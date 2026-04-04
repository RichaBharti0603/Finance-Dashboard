import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { AlertCircle, ArrowDownCircle, ArrowUpCircle, Award } from 'lucide-react';
import { subMonths, isSameMonth, parseISO } from 'date-fns';

export const Insights: React.FC = () => {
  const { transactions } = useFinance();

  const insights = useMemo(() => {
    if (transactions.length === 0) return null;

    const expenses = transactions.filter(t => t.type === 'expense');
    const income = transactions.filter(t => t.type === 'income');

    // 1. Highest Spending Category
    const categoryTotals = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
    
    let topCategory = 'None';
    let topCategoryAmount = 0;
    Object.entries(categoryTotals).forEach(([cat, amount]) => {
      if (amount > topCategoryAmount) {
        topCategory = cat;
        topCategoryAmount = amount;
      }
    });

    // 2. Month-over-Month comparison
    const now = new Date();
    const lastMonth = subMonths(now, 1);

    const thisMonthExpense = expenses
      .filter(t => isSameMonth(parseISO(t.date), now))
      .reduce((sum, t) => sum + t.amount, 0);

    const lastMonthExpense = expenses
      .filter(t => isSameMonth(parseISO(t.date), lastMonth))
      .reduce((sum, t) => sum + t.amount, 0);

    let momChange = 0;
    if (lastMonthExpense > 0) {
      momChange = ((thisMonthExpense - lastMonthExpense) / lastMonthExpense) * 100;
    }

    // 3. Savings Rate (This Month)
    const thisMonthIncome = income
      .filter(t => isSameMonth(parseISO(t.date), now))
      .reduce((sum, t) => sum + t.amount, 0);

    let savingsRate = 0;
    if (thisMonthIncome > 0) {
      savingsRate = ((thisMonthIncome - thisMonthExpense) / thisMonthIncome) * 100;
    }

    return {
      topCategory,
      topCategoryAmount,
      thisMonthExpense,
      momChange,
      savingsRate
    };
  }, [transactions]);

  if (!insights) {
    return (
      <div className="animate-in" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <AlertCircle size={48} style={{ color: 'var(--text-secondary)', margin: '0 auto 1rem' }} />
        <h2>Not enough data for insights</h2>
        <p>Add some transactions to generate insights.</p>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <h1 style={{ marginBottom: '2rem' }}>Financial Insights</h1>

      <div className="grid-cards">
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--warning)' }}>
            <Award size={24} />
            <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1rem' }}>Top Spending Category</h3>
          </div>
          <div>
            <h2 style={{ margin: '0 0 0.25rem 0' }}>{insights.topCategory}</h2>
            <p style={{ margin: 0 }}>
              You've spent <strong>${insights.topCategoryAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong> on this category.
            </p>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: insights.momChange > 0 ? 'var(--danger)' : 'var(--success)' }}>
            {insights.momChange > 0 ? <ArrowUpCircle size={24} /> : <ArrowDownCircle size={24} />}
            <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1rem' }}>MoM Spending Change</h3>
          </div>
          <div>
            <h2 style={{ margin: '0 0 0.25rem 0' }}>
              {Math.abs(insights.momChange).toFixed(1)}% {insights.momChange > 0 ? 'Increase' : 'Decrease'}
            </h2>
            <p style={{ margin: 0 }}>
              Compared to last month. Total this month: ${insights.thisMonthExpense.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)' }}>
            <AlertCircle size={24} />
            <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1rem' }}>Savings Rate (This Month)</h3>
          </div>
          <div>
            <h2 style={{ margin: '0 0 0.25rem 0' }}>{insights.savingsRate.toFixed(1)}%</h2>
            <p style={{ margin: 0 }}>
              {insights.savingsRate > 20 
                ? "Excellent! You're saving more than 20%." 
                : insights.savingsRate > 0 
                  ? "Good job! You're saving." 
                  : "Watch out! Your expenses exceed your income this month."}
            </p>
          </div>
        </div>
      </div>

      <div className="glass-card">
        <h3 style={{ marginBottom: '1rem' }}>Summary</h3>
        <p style={{ marginBottom: '0.5rem' }}>
          Your highest expense area overall is <strong>{insights.topCategory}</strong>. Focus on reducing spending here to improve your savings rate.
        </p>
        <p>
          {insights.momChange > 0 
            ? `Your spending has increased by ${insights.momChange.toFixed(1)}% compared to last month. Consider reviewing your recent ${insights.topCategory} transactions.` 
            : `Great job! Your spending is down ${Math.abs(insights.momChange).toFixed(1)}% from last month.`}
        </p>
      </div>
    </div>
  );
};
