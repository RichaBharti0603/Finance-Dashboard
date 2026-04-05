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

// ✅ FIXED: use 'insights' (not analytics)
export type Tab = 'dashboard' | 'transactions' | 'insights';

export interface FinanceContextType {
  transactions: Transaction[];

  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, t: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  currentRole: Role;
  setRole: (role: Role) => void;

  theme: Theme;
  toggleTheme: () => void;

  currentTab: Tab;
  setCurrentTab: (tab: Tab) => void;

  searchTerm: string;
  setSearchTerm: (term: string) => void;
}