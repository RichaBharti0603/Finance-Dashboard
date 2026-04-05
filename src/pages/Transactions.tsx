import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Download, Plus, Search, Trash2, Edit2, Check, X, Filter } from 'lucide-react';
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
    link.setAttribute("download", "transactions_zorvyn.csv");
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 className="tracking-tight" style={{ margin: 0 }}>Transactions</h1>
          <p className="text-sm" style={{ fontWeight: 500 }}>History of all your financial movements</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-outline" onClick={handleExport}>
            <Download size={18} /> Export Data
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => setIsModalOpen(true)}
            disabled={currentRole === 'viewer'}
          >
            <Plus size={18} /> Add Transaction
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search by description or category..." 
              className="input" 
              style={{ paddingLeft: '3.25rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Filter size={18} color="var(--text-secondary)" />
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
              <option value="">Categories</option>
              {uniqueCategories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-color)', padding: '0.375rem 1rem', borderRadius: '14px' }}>
            <input type="date" className="input" value={dateRange.start} onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))} style={{ border: 'none', background: 'transparent', padding: '0.5rem 0', width: '130px' }} />
            <span style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>→</span>
            <input type="date" className="input" value={dateRange.end} onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))} style={{ border: 'none', background: 'transparent', padding: '0.5rem 0', width: '130px' }} />
          </div>
        </div>

        {/* Chips Area */}
        {(selectedCategories.length > 0 || minAmount > 0 || dateRange.start || dateRange.end || searchTerm) && (
          <div className="animate-in" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px dashed var(--border-color)' }}>
            {searchTerm && (
              <span className="badge badge-income" style={{ borderRadius: '12px', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Search: {searchTerm} <button onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}><X size={14} /></button>
              </span>
            )}
            {selectedCategories.map(c => (
              <span key={c} className="badge badge-income" style={{ background: 'var(--ring)', color: 'var(--primary)', borderRadius: '12px', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {c} <button onClick={() => setSelectedCategories(prev => prev.filter(cat => cat !== c))} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}><X size={14} /></button>
              </span>
            ))}
            {(dateRange.start || dateRange.end) && (
              <span className="badge badge-income" style={{ borderRadius: '12px', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {dateRange.start || '---'} to {dateRange.end || '---'} <button onClick={() => setDateRange({ start: '', end: '' })} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}><X size={14} /></button>
              </span>
            )}
            <button onClick={() => { setSearchTerm(''); setSelectedCategories([]); setDateRange({start: '', end: ''}); }} style={{ color: 'var(--danger)', background: 'none', border: 'none', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}>Clear all</button>
          </div>
        )}
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table style={{ borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.02)' }}>
                <th style={{ padding: '1.25rem 1.5rem' }}>DATE</th>
                <th style={{ padding: '1.25rem 1.5rem' }}>DESCRIPTION</th>
                <th style={{ padding: '1.25rem 1.5rem' }}>CATEGORY</th>
                <th style={{ padding: '1.25rem 1.5rem' }}>TYPE</th>
                <th style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>AMOUNT</th>
                <th style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    No transactions found for the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(t => (
                  <tr key={t.id} style={{ transition: 'background 0.2s' }}>
                    {editingId === t.id ? (
                      <>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <input type="date" className="input text-sm" style={{ padding: '0.5rem' }} value={editForm.dateInput || ''} onChange={e => setEditForm(prev => ({ ...prev, dateInput: e.target.value }))} />
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <input type="text" className="input text-sm" placeholder="Description" style={{ padding: '0.5rem' }} value={editForm.description || ''} onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))} />
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <input type="text" className="input text-sm" placeholder="Category" style={{ padding: '0.5rem' }} value={editForm.category || ''} onChange={e => setEditForm(prev => ({ ...prev, category: e.target.value }))} />
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <select className="select text-sm" style={{ padding: '0.5rem' }} value={editForm.type || 'expense'} onChange={e => setEditForm(prev => ({ ...prev, type: e.target.value as any }))}>
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                          </select>
                        </td>
                        <td style={{ padding: '1rem 1.5rem' }}>
                          <input type="number" step="0.01" className="input text-sm" style={{ padding: '0.5rem', textAlign: 'right' }} value={editForm.amount || ''} onChange={e => setEditForm(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))} />
                        </td>
                        <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <button className="btn-icon" style={{ borderColor: 'var(--success)', color: 'var(--success)' }} onClick={saveEditing}><Check size={16} /></button>
                            <button className="btn-icon" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={cancelEditing}><X size={16} /></button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: '1.25rem 1.5rem', fontWeight: 500 }}>{format(parseISO(t.date), 'MMM dd, yyyy')}</td>
                        <td style={{ padding: '1.25rem 1.5rem', fontWeight: 600 }}>{t.description || '-'}</td>
                        <td style={{ padding: '1.25rem 1.5rem' }}>
                          <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{t.category}</span>
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem' }}>
                          <span className={`badge ${t.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                            {t.type.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right', fontWeight: 800, color: t.type === 'income' ? 'var(--success)' : 'var(--text-main)' }}>
                          {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <button className="btn-icon" onClick={() => currentRole === 'admin' && startEditing(t)} disabled={currentRole === 'viewer'}><Edit2 size={16} /></button>
                            <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={() => currentRole === 'admin' && deleteTransaction(t.id)} disabled={currentRole === 'viewer'}><Trash2 size={16} /></button>
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
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ borderRadius: '24px' }}>
            <div className="modal-header">
              <h2 style={{ margin: 0 }}>New Transaction</h2>
              <button className="btn-icon" onClick={() => setIsModalOpen(false)} style={{ border: 'none' }}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
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
              
              <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                <label className="input-label">Amount (₹)</label>
                <input type="number" step="0.01" min="0" className="input" placeholder="0.00" required value={amount} onChange={e => setAmount(e.target.value)} />
              </div>
              
              <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                <label className="input-label">Category</label>
                <input type="text" className="input" placeholder="e.g. Shopping, Rent" required value={category} onChange={e => setCategory(e.target.value)} />
              </div>

              <div className="input-group" style={{ marginBottom: '2.5rem' }}>
                <label className="input-label">Notes (Optional)</label>
                <input type="text" className="input" placeholder="Add a note..." value={description} onChange={e => setDescription(e.target.value)} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" className="btn btn-outline" style={{ border: 'none' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>Save Entry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
