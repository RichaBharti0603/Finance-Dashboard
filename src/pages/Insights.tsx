import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { AlertCircle, ArrowDownCircle, ArrowUpCircle, Award, Target, TrendingUp } from 'lucide-react';
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
      <div className="animate-in" style={{ textAlign: 'center', marginTop: '6rem' }}>
        <AlertCircle size={64} style={{ color: 'var(--text-secondary)', opacity: 0.5, margin: '0 auto 1.5rem' }} />
        <h2 style={{ fontSize: '2rem' }}>Awaiting more data...</h2>
        <p style={{ maxWidth: '400px', margin: '0.5rem auto' }}>We need more transactions to generate meaningful financial patterns for Zorvyn.</p>
        <button className="btn btn-primary" style={{ marginTop: '2rem' }} onClick={() => window.location.reload()}>Refresh Dashboard</button>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="tracking-tight" style={{ margin: 0 }}>Financial Intelligence</h1>
        <p className="text-sm font-bold" style={{ color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>Zorvyn AI Engine</p>
      </div>

      <div className="grid-cards" style={{ marginBottom: '2rem' }}>
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderLeft: '6px solid var(--warning)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--warning)' }}>
            <Award size={28} />
            <span className="text-xs font-bold" style={{ color: 'var(--text-main)', letterSpacing: '0.05em' }}>PEAK EXPENDITURE</span>
          </div>
          <div>
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem' }}>{insights.topCategory}</h2>
            <p style={{ margin: 0, fontWeight: 500 }}>
              Significant concentration of <strong>₹{insights.topCategoryAmount.toLocaleString()}</strong> in this area.
            </p>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderLeft: '6px solid ' + (insights.momChange > 0 ? 'var(--danger)' : 'var(--success)') }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: insights.momChange > 0 ? 'var(--danger)' : 'var(--success)' }}>
            {insights.momChange > 0 ? <ArrowUpCircle size={28} /> : <ArrowDownCircle size={28} />}
            <span className="text-xs font-bold" style={{ color: 'var(--text-main)', letterSpacing: '0.05em' }}>MOM TREND</span>
          </div>
          <div>
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem' }}>
              {Math.abs(insights.momChange).toFixed(1)}% {insights.momChange > 0 ? 'Higher' : 'Lower'}
            </h2>
            <p style={{ margin: 0, fontWeight: 500 }}>
              Monthly spending velocity has changed compared to last month.
            </p>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderLeft: '6px solid var(--primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)' }}>
            <Target size={28} />
            <span className="text-xs font-bold" style={{ color: 'var(--text-main)', letterSpacing: '0.05em' }}>GOAL ADHERENCE</span>
          </div>
          <div>
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem' }}>{insights.savingsRate.toFixed(1)}% Saving</h2>
            <p style={{ margin: 0, fontWeight: 500 }}>
              {insights.savingsRate > 20 
                ? "Excellent efficiency! You're hitting your threshold." 
                : insights.savingsRate > 0 
                  ? "Steady progress. Small adjustments could double this." 
                  : "Critical: Expenses are outpacing current liquidity."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid-charts">
        <div className="glass-card" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div style={{ padding: '2rem', background: 'var(--bg-color)', borderRadius: '24px', color: 'var(--primary)' }}>
            <TrendingUp size={48} />
          </div>
          <div>
            <h3 style={{ marginBottom: '0.75rem' }}>Analysis Summary</h3>
            <p style={{ maxWidth: '600px', fontWeight: 500 }}>
              The data suggests that <strong>{insights.topCategory}</strong> is the primary driver of your outward cash flow.
              {insights.momChange > 0 
                ? ` There has been a notable increase in spending velocity this month (+${insights.momChange.toFixed(1)}%). We recommend auditing recent transactions in ${insights.topCategory} to identify potential recurring leakages.`
                : ` Your disciplined approach has successfully reduced spending by ${Math.abs(insights.momChange).toFixed(1)}%. This capital is now available for target-based savings.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
