// src/utils/financeUtils.ts

export type Transaction = {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string; // ISO string
};

// -----------------------------
// BASIC CALCULATIONS
// -----------------------------

export const calculateTotals = (transactions: Transaction[]) => {
  let income = 0;
  let expense = 0;

  transactions.forEach((t) => {
    if (t.type === 'income') income += t.amount;
    else expense += t.amount;
  });

  return {
    income,
    expense,
    balance: income - expense,
  };
};

// -----------------------------
// FINANCIAL HEALTH SCORE
// -----------------------------

export const calculateHealthScore = (transactions: Transaction[]) => {
  const { income, expense } = calculateTotals(transactions);

  if (income === 0) return 0;

  const savingsRate = (income - expense) / income;

  let score = 50;

  // Savings behavior
  if (savingsRate > 0.4) score += 30;
  else if (savingsRate > 0.2) score += 15;
  else score -= 10;

  // Expense control
  if (expense > income * 0.9) score -= 20;

  // Stability (basic heuristic)
  if (transactions.length > 10) score += 10;

  return Math.max(0, Math.min(100, Math.round(score)));
};

// -----------------------------
// CATEGORY ANALYSIS
// -----------------------------

export const getCategoryBreakdown = (transactions: Transaction[]) => {
  const map: Record<string, number> = {};

  transactions.forEach((t) => {
    if (t.type === 'expense') {
      map[t.category] = (map[t.category] || 0) + t.amount;
    }
  });

  return map;
};

export const getTopCategory = (transactions: Transaction[]) => {
  const breakdown = getCategoryBreakdown(transactions);

  const sorted = Object.entries(breakdown).sort(
    (a, b) => b[1] - a[1]
  );

  return sorted[0] || null;
};

// -----------------------------
// TIME-BASED ANALYSIS
// -----------------------------

export const getMonthlyTotals = (transactions: Transaction[]) => {
  const map: Record<string, number> = {};

  transactions.forEach((t) => {
    const month = new Date(t.date).toLocaleString('default', {
      month: 'short',
      year: 'numeric',
    });

    map[month] = (map[month] || 0) + t.amount;
  });

  return map;
};

export const getDailySpendingPeak = (transactions: Transaction[]) => {
  const map: Record<string, number> = {};

  transactions.forEach((t) => {
    if (t.type === 'expense') {
      const day = t.date.split('T')[0];
      map[day] = (map[day] || 0) + t.amount;
    }
  });

  const sorted = Object.entries(map).sort(
    (a, b) => b[1] - a[1]
  );

  return sorted[0] || null;
};

// -----------------------------
// SMART INSIGHTS ENGINE
// -----------------------------

export const generateInsights = (transactions: Transaction[]) => {
  if (!transactions.length) {
    return [
      {
        title: 'No Data',
        description: 'Add transactions to see insights.',
      },
    ];
  }

  const { income, expense, balance } = calculateTotals(transactions);
  const topCategory = getTopCategory(transactions);
  const peakDay = getDailySpendingPeak(transactions);

  const insights = [];

  // Balance insight
  insights.push({
    title: 'Current Balance',
    description: `You have ₹${balance} remaining.`,
  });

  // Spending ratio
  if (income > 0) {
    const ratio = ((expense / income) * 100).toFixed(1);
    insights.push({
      title: 'Spending Ratio',
      description: `You spent ${ratio}% of your income.`,
    });
  }

  // Top category
  if (topCategory) {
    insights.push({
      title: 'Top Spending Category',
      description: `${topCategory[0]} (₹${topCategory[1]})`,
    });
  }

  // Peak day
  if (peakDay) {
    insights.push({
      title: 'Highest Spending Day',
      description: `${peakDay[0]} (₹${peakDay[1]})`,
    });
  }

  // Savings suggestion
  if (balance < 0) {
    insights.push({
      title: 'Warning',
      description: 'You are overspending. Consider reducing expenses.',
    });
  } else if (balance > income * 0.3) {
    insights.push({
      title: 'Great Job',
      description: 'You are maintaining a healthy savings rate.',
    });
  }

  return insights;
};

// -----------------------------
// FILTERING LOGIC
// -----------------------------

export type Filters = {
  category?: string;
  minAmount?: number;
  maxAmount?: number;
  type?: 'income' | 'expense';
};

export const applyFilters = (
  transactions: Transaction[],
  filters: Filters
) => {
  return transactions.filter((t) => {
    if (filters.category && t.category !== filters.category) return false;
    if (filters.type && t.type !== filters.type) return false;
    if (filters.minAmount && t.amount < filters.minAmount) return false;
    if (filters.maxAmount && t.amount > filters.maxAmount) return false;

    return true;
  });
};

// -----------------------------
// WHAT-IF SIMULATION
// -----------------------------

export const simulateExpenseReduction = (
  transactions: Transaction[],
  reductionPercent: number
) => {
  return transactions.map((t) => {
    if (t.type === 'expense') {
      return {
        ...t,
        amount: t.amount * (1 - reductionPercent / 100),
      };
    }
    return t;
  });
};