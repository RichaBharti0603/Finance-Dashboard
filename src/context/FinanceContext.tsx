import React, { createContext, useState, useContext } from 'react';
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

// ✅ SINGLE context (typed)
export const FinanceContext = createContext<FinanceContextValue | undefined>(undefined);

// ✅ Provider
export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentRole, setCurrentRole] = useState<Role>('admin');
  const [theme, setTheme] = useState<Theme>('light');
  const [currentTab, setCurrentTab] = useState<Tab>('dashboard');
  const [searchTerm, setSearchTerm] = useState<string>('');

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

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
};