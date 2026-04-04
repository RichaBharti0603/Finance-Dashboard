import type { Transaction } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { subDays } from 'date-fns';

const today = new Date();

export const initialTransactions: Transaction[] = [
  { id: uuidv4(), date: subDays(today, 1).toISOString(), amount: 3500, category: 'Salary', type: 'income', description: 'Monthly Salary' },
  { id: uuidv4(), date: subDays(today, 2).toISOString(), amount: 120, category: 'Groceries', type: 'expense', description: 'Whole Foods' },
  { id: uuidv4(), date: subDays(today, 3).toISOString(), amount: 60, category: 'Transport', type: 'expense', description: 'Uber' },
  { id: uuidv4(), date: subDays(today, 5).toISOString(), amount: 200, category: 'Entertainment', type: 'expense', description: 'Concert Tickets' },
  { id: uuidv4(), date: subDays(today, 6).toISOString(), amount: 1500, category: 'Rent', type: 'expense', description: 'Apartment Rent' },
  { id: uuidv4(), date: subDays(today, 10).toISOString(), amount: 50, category: 'Utilities', type: 'expense', description: 'Internet Bill' },
  { id: uuidv4(), date: subDays(today, 12).toISOString(), amount: 300, category: 'Freelance', type: 'income', description: 'Upwork Project' },
  { id: uuidv4(), date: subDays(today, 15).toISOString(), amount: 90, category: 'Dining', type: 'expense', description: 'Dinner out' },
  { id: uuidv4(), date: subDays(today, 20).toISOString(), amount: 45, category: 'Subscriptions', type: 'expense', description: 'Netflix & Spotify' },
];
