import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Download, Plus, Search, Trash2, Edit2, Check, X } from 'lucide-react';
import type { Transaction } from '../types';
import { format, parseISO } from 'date-fns';

export const Transactions: React.FC = () => {
  const { transactions, currentRole, addTransaction, deleteTransaction, searchTerm, setSearchTerm } = useFinance();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [minAmount, setMinAmount] = useState<number>(0);

  // Form state
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [description, setDescription] = useState('');

  // Inline Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Transaction & { dateInput?: string }>>({});

  const { updateTransaction } = useFinance();

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = (t.description || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(t.category);
      const matchAmount = t.amount >= minAmount;
      
      let matchDate = true;
      if (dateRange.start) {
        matchDate = matchDate && new Date(t.date).getTime() >= new Date(dateRange.start).setHours(0,0,0,0);
      }
      if (dateRange.end) {
        matchDate = matchDate && new Date(t.date).getTime() <= new Date(dateRange.end).setHours(23,59,59,999);
      }

      return matchSearch && matchCategory && matchAmount && matchDate;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchTerm, selectedCategories, minAmount, dateRange]);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(transactions.map(t => t.category))).sort();
  }, [transactions]);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Description,Category,Type,Amount\n"
      + filteredTransactions.map(t => `${format(parseISO(t.date), 'yyyy-MM-dd')},${t.description || ''},${t.category},${t.type},${t.amount}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;
    
    addTransaction({
      amount: parseFloat(amount),
      category,
      date: new Date(date).toISOString(),
      type,
      description
    });
    
    setIsModalOpen(false);
    // Reset form
    setAmount('');
    setCategory('');
    setDescription('');
  };

  const startEditing = (t: Transaction) => {
    setEditingId(t.id);
    setEditForm({ 
      ...t, 
      dateInput: format(parseISO(t.date), 'yyyy-MM-dd') 
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEditing = () => {
    if (editingId && editForm.amount !== undefined && editForm.category && editForm.dateInput) {
      updateTransaction(editingId, {
        amount: Number(editForm.amount),
        category: editForm.category,
        type: editForm.type,
        description: editForm.description,
        date: new Date(editForm.dateInput).toISOString()
      });
      setEditingId(null);
      setEditForm({});
    }
  };

  return (
    <div className="animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>Transactions</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline" onClick={handleExport}>
            <Download size={16} /> Export CSV
          </button>
          <span title={currentRole === 'viewer' ? 'Admin access required' : ''}>
            <button 
              className="btn btn-primary" 
              onClick={() => setIsModalOpen(true)}
              disabled={currentRole === 'viewer'}
              style={{ cursor: currentRole === 'viewer' ? 'not-allowed' : 'pointer' }}
            >
              <Plus size={16} /> Add New
            </button>
          </span>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '200px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="input" 
              style={{ paddingLeft: '2.5rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select 
            className="select" 
            style={{ width: '180px' }} 
            value="" 
            onChange={(e) => {
              if (e.target.value && !selectedCategories.includes(e.target.value)) {
                setSelectedCategories([...selectedCategories, e.target.value]);
              }
            }}
          >
            <option value="">+ Add Category</option>
            {uniqueCategories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="date" className="input" value={dateRange.start} onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))} style={{ width: '135px' }} />
            <span style={{ color: 'var(--text-secondary)' }}>to</span>
            <input type="date" className="input" value={dateRange.end} onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))} style={{ width: '135px' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '200px' }}>
            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Min: ${minAmount}</label>
            <input 
              type="range" 
              min="0" 
              max="10000" 
              step="50" 
              value={minAmount} 
              onChange={e => setMinAmount(Number(e.target.value))} 
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Chips Area */}
        {(selectedCategories.length > 0 || minAmount > 0 || dateRange.start || dateRange.end || searchTerm) && (
          <div className="animate-in" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-color)' }}>
            {searchTerm && (
              <span className="chip">
                "{searchTerm}" <button onClick={() => setSearchTerm('')}><X size={14} /></button>
              </span>
            )}
            {selectedCategories.map(c => (
              <span key={c} className="chip">
                {c} <button onClick={() => setSelectedCategories(prev => prev.filter(cat => cat !== c))}><X size={14} /></button>
              </span>
            ))}
            {minAmount > 0 && (
              <span className="chip">
                &gt; ${minAmount} <button onClick={() => setMinAmount(0)}><X size={14} /></button>
              </span>
            )}
            {(dateRange.start || dateRange.end) && (
              <span className="chip">
                {dateRange.start || 'Any'} - {dateRange.end || 'Any'} <button onClick={() => setDateRange({ start: '', end: '' })}><X size={14} /></button>
              </span>
            )}
          </div>
        )}
      </div>

      <div className="glass-card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                        No transactions found.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map(t => (
                      <tr key={t.id} style={{ background: editingId === t.id ? 'var(--bg-color)' : 'transparent' }}>
                        {editingId === t.id ? (
                          <>
                            <td>
                              <input type="date" className="input" style={{ padding: '0.25rem', fontSize: '0.875rem' }} value={editForm.dateInput || ''} onChange={e => setEditForm(prev => ({ ...prev, dateInput: e.target.value }))} />
                            </td>
                            <td>
                              <input type="text" className="input" placeholder="Description" style={{ padding: '0.25rem', fontSize: '0.875rem' }} value={editForm.description || ''} onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))} />
                            </td>
                            <td>
                              <input type="text" className="input" placeholder="Category" style={{ padding: '0.25rem', fontSize: '0.875rem', width: '120px' }} value={editForm.category || ''} onChange={e => setEditForm(prev => ({ ...prev, category: e.target.value }))} />
                            </td>
                            <td>
                              <select className="select" style={{ padding: '0.25rem', fontSize: '0.875rem' }} value={editForm.type || 'expense'} onChange={e => setEditForm(prev => ({ ...prev, type: e.target.value as any }))}>
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                              </select>
                            </td>
                            <td>
                              <input type="number" step="0.01" className="input" style={{ padding: '0.25rem', fontSize: '0.875rem', width: '90px' }} value={editForm.amount || ''} onChange={e => setEditForm(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))} />
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="btn-icon" style={{ color: 'var(--success)' }} onClick={saveEditing}>
                                  <Check size={16} />
                                </button>
                                <button className="btn-icon" style={{ color: 'var(--text-secondary)' }} onClick={cancelEditing}>
                                  <X size={16} />
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td>{format(parseISO(t.date), 'MMM dd, yyyy')}</td>
                            <td>{t.description || '-'}</td>
                            <td>{t.category}</td>
                            <td>
                              <span className={`badge ${t.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                                {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                              </span>
                            </td>
                            <td style={{ fontWeight: 500 }}>
                              {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.5rem' }} title={currentRole === 'viewer' ? 'Admin access required' : ''}>
                                <button 
                                  className="btn-icon" 
                                  style={{ color: 'var(--primary)', cursor: currentRole === 'viewer' ? 'not-allowed' : 'pointer' }}
                                  onClick={() => currentRole === 'admin' && startEditing(t)}
                                  aria-label="Edit transaction"
                                  disabled={currentRole === 'viewer'}
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button 
                                  className="btn-icon" 
                                  style={{ color: 'var(--danger)', cursor: currentRole === 'viewer' ? 'not-allowed' : 'pointer' }}
                                  onClick={() => currentRole === 'admin' && deleteTransaction(t.id)}
                                  aria-label="Delete transaction"
                                  disabled={currentRole === 'viewer'}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ margin: 0 }}>Add Transaction</h2>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="input-group">
                  <label className="input-label">Type</label>
                  <select className="select" value={type} onChange={(e) => setType(e.target.value as 'income'|'expense')}>
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Date</label>
                  <input type="date" className="input" required value={date} onChange={e => setDate(e.target.value)} />
                </div>
              </div>
              
              <div className="input-group">
                <label className="input-label">Amount</label>
                <input type="number" step="0.01" min="0" className="input" placeholder="0.00" required value={amount} onChange={e => setAmount(e.target.value)} />
              </div>
              
              <div className="input-group">
                <label className="input-label">Category</label>
                <input type="text" className="input" placeholder="e.g. Groceries, Salary" required value={category} onChange={e => setCategory(e.target.value)} />
              </div>

              <div className="input-group" style={{ marginBottom: '2rem' }}>
                <label className="input-label">Description (Optional)</label>
                <input type="text" className="input" placeholder="Notes..." value={description} onChange={e => setDescription(e.target.value)} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Transaction</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
