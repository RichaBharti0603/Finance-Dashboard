import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Download, Plus, Search, Trash2, Edit2, X, ArrowUpDown, Sparkles } from 'lucide-react';
import type { Transaction } from '../types';
import { format, parseISO } from 'date-fns';

export const Transactions: React.FC = () => {
  const { 
    transactions, currentRole, addTransaction, deleteTransaction, deleteTransactions, 
    searchTerm, setSearchTerm, addToast 
  } = useFinance();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Sort State
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<'all' | 'income' | 'expense'>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Form state
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [description, setDescription] = useState('');

  // Smart Suggestion Logic
  const suggestCategory = (desc: string) => {
    const d = desc.toLowerCase();
    if (d.includes('salary') || d.includes('paycheck')) return 'Salary';
    if (d.includes('swiggy') || d.includes('zomato') || d.includes('restaurant') || d.includes('food')) return 'Food';
    if (d.includes('amazon') || d.includes('flipkart') || d.includes('clothes')) return 'Shopping';
    if (d.includes('uber') || d.includes('ola') || d.includes('petrol')) return 'Transport';
    if (d.includes('rent') || d.includes('bill')) return 'Housing';
    return '';
  };

  const handleDescChange = (val: string) => {
    setDescription(val);
    const suggested = suggestCategory(val);
    if (suggested && !category) setCategory(suggested);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = (t.description || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(t.category);
      const matchType = selectedType === 'all' || t.type === selectedType;
      let matchDate = true;
      if (dateRange.start) matchDate = matchDate && new Date(t.date).getTime() >= new Date(dateRange.start).setHours(0,0,0,0);
      if (dateRange.end) matchDate = matchDate && new Date(t.date).getTime() <= new Date(dateRange.end).setHours(23,59,59,999);

      return matchSearch && matchCategory && matchType && matchDate;
    }).sort((a, b) => {
      const valA = sortField === 'date' ? new Date(a.date).getTime() : a.amount;
      const valB = sortField === 'date' ? new Date(b.date).getTime() : b.amount;
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
  }, [transactions, searchTerm, selectedCategories, selectedType, dateRange, sortField, sortOrder]);

  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(transactions.map(t => t.category))).sort();
  }, [transactions]);

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortField === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortOrder('desc'); }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(filteredTransactions.map(t => t.id));
    else setSelectedIds([]);
  };

  const handleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleBulkDelete = () => {
    if (currentRole !== 'admin') { addToast('Permission Denied', 'error'); return; }
    deleteTransactions(selectedIds);
    setSelectedIds([]);
  };

  const handleExport = () => {
    const csvContent = "Date,Description,Category,Type,Amount\n"
      + filteredTransactions.map(t => `${format(parseISO(t.date), 'yyyy-MM-dd')},${t.description || ''},${t.category},${t.type},${t.amount}`).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `zorvyn_transactions_${Date.now()}.csv`;
    link.click();
  };

  const startEditing = (t: Transaction) => {
    if(currentRole !== 'admin') return;
    addToast(`Inline editing for ${t.category} coming soon.`, 'info');
  };

  return (
    <div className="animate-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 className="tracking-tight" style={{ margin: 0 }}>Ledger</h1>
          <p className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>Advanced Transaction Management</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-outline" onClick={handleExport}>
            <Download size={18} /> Export
          </button>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Add Entry
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Filter by keyword..." 
              className="input" 
              style={{ paddingLeft: '3.25rem' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <select className="select" style={{ width: '130px' }} value={selectedType} onChange={e => setSelectedType(e.target.value as any)}>
              <option value="all">Direction</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select className="select" style={{ width: '150px' }} value="" onChange={e => e.target.value && !selectedCategories.includes(e.target.value) && setSelectedCategories([...selectedCategories, e.target.value])}>
              <option value="">Category</option>
              {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-color)', padding: '0.25rem 0.75rem', borderRadius: '12px' }}>
             <input type="date" className="input" value={dateRange.start} onChange={e => setDateRange(prev => ({...prev, start: e.target.value}))} style={{ border: 'none', background: 'transparent', width: '120px', fontSize: '0.8125rem' }} />
             <span className="text-secondary">→</span>
             <input type="date" className="input" value={dateRange.end} onChange={e => setDateRange(prev => ({...prev, end: e.target.value}))} style={{ border: 'none', background: 'transparent', width: '120px', fontSize: '0.8125rem' }} />
          </div>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <div className="animate-in" style={{ 
          background: 'var(--primary)', color: 'white', padding: '1rem 1.5rem', 
          borderRadius: '16px', display: 'flex', justifyContent: 'space-between', 
          alignItems: 'center', marginBottom: '1.5rem', boxShadow: '0 10px 15px -3px var(--ring)'
        }}>
          <span className="font-bold">{selectedIds.length} items selected</span>
          <div style={{ display: 'flex', gap: '1rem' }}>
             <button className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }} onClick={() => setSelectedIds([])}>Cancel</button>
             <button className="btn" style={{ background: 'var(--danger)', color: 'white' }} onClick={handleBulkDelete}>
                <Trash2 size={16} /> Bulk Remove
             </button>
          </div>
        </div>
      )}

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th style={{ width: '40px' }}><input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === filteredTransactions.length && filteredTransactions.length > 0} /></th>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('date')}>
                  DATE <ArrowUpDown size={12} style={{ opacity: sortField === 'date' ? 1 : 0.3 }} />
                </th>
                <th>DESCRIPTION</th>
                <th>CATEGORY</th>
                <th>DIRECTION</th>
                <th style={{ cursor: 'pointer', textAlign: 'right' }} onClick={() => toggleSort('amount')}>
                  AMOUNT <ArrowUpDown size={12} style={{ opacity: sortField === 'amount' ? 1 : 0.3 }} />
                </th>
                <th style={{ textAlign: 'center' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(t => (
                <tr key={t.id}>
                  <td><input type="checkbox" checked={selectedIds.includes(t.id)} onChange={() => handleSelect(t.id)} /></td>
                  <td style={{ fontWeight: 600 }}>{format(parseISO(t.date), 'MMM dd, yyyy')}</td>
                  <td style={{ fontWeight: 600 }}>{t.description || '-'}</td>
                  <td><span style={{ opacity: 0.7, fontWeight: 700 }}>{t.category}</span></td>
                  <td><span className={`badge ${t.type === 'income' ? 'badge-income' : 'badge-expense'}`}>{t.type.toUpperCase()}</span></td>
                  <td style={{ textAlign: 'right', fontWeight: 800, color: t.type === 'income' ? 'var(--success)' : 'var(--text-main)' }}>
                    {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                     <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button className="btn-icon" onClick={() => startEditing(t)} disabled={currentRole === 'viewer'} title={currentRole === 'viewer' ? 'Admin only' : ''}>
                           <Edit2 size={16} />
                        </button>
                        <button className="btn-icon" style={{ color: 'var(--danger)' }} onClick={() => deleteTransaction(t.id)} disabled={currentRole === 'viewer'}>
                           <Trash2 size={16} />
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Create Entry</h2>
              <button className="btn-icon" style={{ border: 'none' }} onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <button className={`btn flex-1 ${type === 'expense' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setType('expense')}>Expense</button>
              <button className={`btn flex-1 ${type === 'income' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setType('income')}>Income</button>
            </div>
            
            <div className="input-group" style={{ marginBottom: '1rem' }}>
               <label className="text-xs font-bold text-secondary">DESCRIPTION</label>
               <input type="text" className="input" placeholder="What was this for?" value={description} onChange={e => handleDescChange(e.target.value)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
               <div className="input-group">
                  <label className="text-xs font-bold text-secondary">AMOUNT (₹)</label>
                  <input type="number" className="input" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} />
               </div>
               <div className="input-group">
                  <label className="text-xs font-bold text-secondary">DATE</label>
                  <input type="date" className="input" value={date} onChange={e => setDate(e.target.value)} />
               </div>
            </div>

            <div className="input-group" style={{ marginBottom: '2.5rem' }}>
               <label className="text-xs font-bold text-secondary">CATEGORY</label>
               <div style={{ position: 'relative' }}>
                  <input type="text" className="input" placeholder="Groceries, Rent..." value={category} onChange={e => setCategory(e.target.value)} />
                  {category === suggestCategory(description) && category !== '' && (
                    <div style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                       <Sparkles size={14} /> <span className="text-xs font-bold">Suggested</span>
                    </div>
                  )}
               </div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', padding: '1rem' }} onClick={() => {
              if(!amount || !category) return;
              addTransaction({ amount: parseFloat(amount), category, date: new Date(date).toISOString(), type, description });
              setIsModalOpen(false);
              setAmount(''); setCategory(''); setDescription(''); setDescription('');
            }}>Save to Zorvyn</button>
          </div>
        </div>
      )}
    </div>
  );
};
