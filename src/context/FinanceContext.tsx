import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import type { Transaction, Role, Theme, Tab, Goal, Toast, FinanceContextType } from '../types';

export const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const defaultTransactions: Transaction[] = [
  { id: '1', date: '2024-04-01', amount: 50000, category: 'Salary', type: 'income', description: 'Monthly salary' },
  { id: '2', date: '2024-04-02', amount: 1500, category: 'Food', type: 'expense', description: 'Swiggy order' },
  { id: '3', date: '2024-04-03', amount: 2000, category: 'Shopping', type: 'expense', description: 'Clothes' },
  { id: '4', date: '2024-04-04', amount: 3000, category: 'Freelance', type: 'income', description: 'Side project' },
];

const defaultGoals: Goal[] = [
  { id: 'g1', name: 'Emergency Fund', targetAmount: 100000, currentAmount: 45000 },
  { id: 'g2', name: 'New Laptop', targetAmount: 85000, currentAmount: 12000 },
];

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : defaultTransactions;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('goals');
    return saved ? JSON.parse(saved) : defaultGoals;
  });

  const [currentRole, setCurrentRole] = useState<Role>(() => {
    return (localStorage.getItem('role') as Role) || 'admin';
  });

  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'light';
  });

  const [currentTab, setCurrentTab] = useState<Tab>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // PERSISTENCE
  useEffect(() => localStorage.setItem('transactions', JSON.stringify(transactions)), [transactions]);
  useEffect(() => localStorage.setItem('goals', JSON.stringify(goals)), [goals]);
  useEffect(() => localStorage.setItem('role', currentRole), [currentRole]);
  useEffect(() => localStorage.setItem('theme', theme), [theme]);

  // TOAST HANDLER
  const addToast = useCallback((message: string, type: Toast['type']) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // RBAC GUARD
  const checkAdmin = () => {
    if (currentRole !== 'admin') {
      addToast('Permission Denied: Admin role required for this action.', 'error');
      return false;
    }
    return true;
  };

  // MUTATIONS
  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    if (!checkAdmin()) return;
    const newTransaction: Transaction = { ...t, id: Date.now().toString() };
    setTransactions(prev => [...prev, newTransaction]);
    addToast('Transaction recorded successfully.', 'success');
  };

  const updateTransaction = (id: string, updated: Partial<Transaction>) => {
    if (!checkAdmin()) return;
    setTransactions(prev => prev.map(t => (t.id === id ? { ...t, ...updated } : t)));
    addToast('Transaction updated.', 'success');
  };

  const deleteTransaction = (id: string) => {
    if (!checkAdmin()) return;
    setTransactions(prev => prev.filter(t => t.id !== id));
    addToast('Transaction removed.', 'info');
  };

  const deleteTransactions = (ids: string[]) => {
    if (!checkAdmin()) return;
    setTransactions(prev => prev.filter(t => !ids.includes(t.id)));
    addToast(`${ids.length} transactions removed.`, 'info');
  };

  const addGoal = (g: Omit<Goal, 'id' | 'currentAmount'>) => {
    if (!checkAdmin()) return;
    const newGoal: Goal = { ...g, id: Date.now().toString(), currentAmount: 0 };
    setGoals(prev => [...prev, newGoal]);
    addToast('Goal tracker initialised.', 'success');
  };

  const updateGoal = (id: string, updated: Partial<Goal>) => {
    if (!checkAdmin()) return;
    setGoals(prev => prev.map(g => (g.id === id ? { ...g, ...updated } : g)));
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        deleteTransactions,
        goals,
        addGoal,
        updateGoal,
        currentRole,
        setRole: (role: Role) => {
          setCurrentRole(role);
          addToast(`Switched to ${role.toUpperCase()} mode.`, 'info');
        },
        theme,
        toggleTheme,
        currentTab,
        setCurrentTab,
        searchTerm,
        setSearchTerm,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
};