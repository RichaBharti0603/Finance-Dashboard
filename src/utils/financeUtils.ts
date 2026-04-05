// src/utils/financeUtils.ts
import { startOfMonth, subMonths, isWithinInterval, endOfMonth, parseISO } from 'date-fns';

export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  description?: string;
}

export const calculateTotals = (transactions: Transaction[]) => {
  let income = 0;
  let expense = 0;
  transactions.forEach((t) => {
    if (t.type === 'income') income += t.amount;
    else expense += t.amount;
  });
  return { income, expense, balance: income - expense };
};

// NET WORTH TREND (Cumulative Balance)
export const getNetWorthTrend = (transactions: Transaction[]) => {
  const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  let runningBalance = 0;
  
  return sorted.map(t => {
    runningBalance += t.type === 'income' ? t.amount : -t.amount;
    return {
      date: t.date.split('T')[0],
      balance: runningBalance,
      label: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  });
};

// SPENDING VELOCITY (Avg spend per day in last 30 days)
export const getSpendingVelocity = (transactions: Transaction[]) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentExpenses = transactions.filter(t => 
    t.type === 'expense' && new Date(t.date) >= thirtyDaysAgo
  );
  
  const total = recentExpenses.reduce((sum, t) => sum + t.amount, 0);
  return Math.round(total / 30);
};

// SAVINGS RATE
export const getSavingsRate = (transactions: Transaction[]) => {
  const { income, expense } = calculateTotals(transactions);
  if (income === 0) return 0;
  return Math.round(((income - expense) / income) * 100);
};

// PERIOD COMPARISON (Current Month vs Previous Month)
export const getPeriodComparison = (transactions: Transaction[]) => {
  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const currentMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const currentMonthExp = transactions
    .filter(t => t.type === 'expense' && isWithinInterval(parseISO(t.date), { start: currentMonthStart, end: currentMonthEnd }))
    .reduce((sum, t) => sum + t.amount, 0);

  const lastMonthExp = transactions
    .filter(t => t.type === 'expense' && isWithinInterval(parseISO(t.date), { start: lastMonthStart, end: lastMonthEnd }))
    .reduce((sum, t) => sum + t.amount, 0);

  let percentChange = 0;
  if (lastMonthExp > 0) {
    percentChange = ((currentMonthExp - lastMonthExp) / lastMonthExp) * 100;
  }

  return {
    current: currentMonthExp,
    previous: lastMonthExp,
    diff: currentMonthExp - lastMonthExp,
    percentChange: Math.round(percentChange)
  };
};

export const calculateHealthScore = (transactions: Transaction[]) => {
  const { income, expense } = calculateTotals(transactions);
  if (income === 0) return 0;
  const savingsRate = (income - expense) / income;
  let score = 50;
  if (savingsRate > 0.4) score += 30;
  else if (savingsRate > 0.2) score += 15;
  else score -= 10;
  if (expense > income * 0.9) score -= 20;
  if (transactions.length > 10) score += 10;
  return Math.max(0, Math.min(100, Math.round(score)));
};

export const getCategoryBreakdown = (transactions: Transaction[]) => {
  const map: Record<string, number> = {};
  transactions.forEach((t) => {
    if (t.type === 'expense') map[t.category] = (map[t.category] || 0) + t.amount;
  });
  return map;
};

export const getSpendingTier = (transactions: Transaction[]) => {
  const comp = getPeriodComparison(transactions);
  if (comp.percentChange < -10) return { label: 'OPTIMAL', color: 'var(--success)', level: 'saver' };
  if (comp.percentChange < 15) return { label: 'BALANCED', color: 'var(--warning)', level: 'balanced' };
  return { label: 'HIGH BURN', color: 'var(--danger)', level: 'over' };
};

export const getTopCategory = (transactions: Transaction[]) => {
  const breakdown = getCategoryBreakdown(transactions);
  const sorted = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
  return sorted[0] || null;
};

// ANOMALY DETECTION (Expenses > 2x Category Average)
export const getAnomalies = (transactions: Transaction[]) => {
  const categories = getCategoryBreakdown(transactions);
  const categoryCounts: Record<string, number> = {};
  transactions.forEach(t => {
    if (t.type === 'expense') categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
  });

  return transactions.filter(t => {
    if (t.type === 'income') return false;
    const avg = categories[t.category] / categoryCounts[t.category];
    return t.amount > avg * 2 && t.amount > 5000; // threshold to avoid noise
  });
};

// FORECASTING (Predict next month expenses)
export const predictNextMonth = (transactions: Transaction[]) => {
  const last3Months = [0, 1, 2].map(m => {
    const start = startOfMonth(subMonths(new Date(), m));
    const end = endOfMonth(subMonths(new Date(), m));
    return transactions
      .filter(t => t.type === 'expense' && isWithinInterval(parseISO(t.date), { start, end }))
      .reduce((sum, t) => sum + t.amount, 0);
  });
  
  const avg = last3Months.reduce((a, b) => a + b, 0) / 3;
  return Math.round(avg);
};

// SUBSCRIPTION DETECTION (Recurring expenses)
export const getSubscriptions = (transactions: Transaction[]) => {
  const expenses = transactions.filter(t => t.type === 'expense');
  const groups: Record<string, Transaction[]> = {};
  
  expenses.forEach(t => {
     const key = `${t.category}-${t.description || 'no-desc'}`;
     if (!groups[key]) groups[key] = [];
     groups[key].push(t);
  });

  return Object.entries(groups)
    .filter(([_, items]) => items.length >= 2) // Appears at least twice
    .map(([key, items]) => ({
       name: key.split('-')[1],
       category: key.split('-')[0],
       avgAmount: items.reduce((sum, t) => sum + t.amount, 0) / items.length,
       count: items.length
    }));
};