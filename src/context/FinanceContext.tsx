import React, { createContext, useState, useContext, useEffect } from 'react';
import type { Transaction, Role, Theme, Tab } from '../types';

export type FinanceContextValue = {
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updated: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  currentRole: Role;
  setRole: React.Dispatch<React.SetStateAction<Role>>;

  theme: Theme;
  toggleTheme: () => void;

  currentTab: Tab;
  setCurrentTab: React.Dispatch<React.SetStateAction<Tab>>;

  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

// ✅ DEFAULT MOCK DATA (RESTORED)
const defaultTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-04-01',
    amount: 50000,
    category: 'Salary',
    type: 'income',
    description: 'Monthly salary',
  },
  {
    id: '2',
    date: '2024-04-02',
    amount: 1500,
    category: 'Food',
    type: 'expense',
    description: 'Swiggy order',
  },
  {
    id: '3',
    date: '2024-04-03',
    amount: 2000,
    category: 'Shopping',
    type: 'expense',
    description: 'Clothes',
  },
  {
    id: '4',
    date: '2024-04-04',
    amount: 3000,
    category: 'Freelance',
    type: 'income',
    description: 'Side project',
  },
];

// ✅ Context
export const FinanceContext = createContext<FinanceContextValue | undefined>(undefined);

// ✅ Provider
export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  // ✅ Load from localStorage OR fallback to mock data
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : defaultTransactions;
  });

  const [currentRole, setCurrentRole] = useState<Role>('admin');

  // ✅ Theme persistence
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'light';
  });

  const [currentTab, setCurrentTab] = useState<Tab>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // ✅ Persist transactions
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  // ✅ Persist theme
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...t,
      id: Date.now().toString(),
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const updateTransaction = (id: string, updated: Partial<Transaction>) => {
    setTransactions(prev =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter((t) => t.id !== id));
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
        currentRole,
        setRole: setCurrentRole,
        theme,
        toggleTheme,
        currentTab,
        setCurrentTab,
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

// ✅ Hook
export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
};