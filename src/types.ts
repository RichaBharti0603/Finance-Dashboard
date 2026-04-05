export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  description?: string;
}

export type Role = 'viewer' | 'admin';
export type Theme = 'light' | 'dark';
export type Tab = 'dashboard' | 'transactions' | 'insights';

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  category?: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'info' | 'error' | 'success';
}

export interface FinanceContextType {
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, t: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  deleteTransactions: (ids: string[]) => void;

  goals: Goal[];
  addGoal: (g: Omit<Goal, 'id' | 'currentAmount'>) => void;
  updateGoal: (id: string, g: Partial<Goal>) => void;

  currentRole: Role;
  setRole: (role: Role) => void;

  theme: Theme;
  toggleTheme: () => void;

  currentTab: Tab;
  setCurrentTab: (tab: Tab) => void;

  searchTerm: string;
  setSearchTerm: (term: string) => void;

  toasts: Toast[];
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
}