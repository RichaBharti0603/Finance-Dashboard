import React, { useMemo, useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell
} from 'recharts';
import { HealthScore } from '../components/HealthScore';
import { SmartInsights } from '../components/SmartInsights';
import { TrendingUp, Wallet, CreditCard, PiggyBank, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { calculateHealthScore } from '../utils/financeUtils';

export const Dashboard: React.FC = () => {
  const { transactions, setSearchTerm, setCurrentTab } = useFinance();
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'year'>('month');

  const healthScore = useMemo(() => calculateHealthScore(transactions), [transactions]);

  // Summary Logic
  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach(t => {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
    });
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const savingsRate = totals.income > 0 ? Math.round(((totals.income - totals.expense) / totals.income) * 100) : 0;

  // Chart Data Preparation
  const trendData = useMemo(() => {
    const groups: Record<string, { date: string, income: number, expense: number }> = {};
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    sorted.forEach(t => {
      const d = new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!groups[d]) groups[d] = { date: d, income: 0, expense: 0 };
      if (t.type === 'income') groups[d].income += t.amount;
      else groups[d].expense += t.amount;
    });
    
    return Object.values(groups);
  }, [transactions]);

  const categoryData = useMemo(() => {
    const grouped: Record<string, number> = {};
    transactions.forEach((t) => {
      if (t.type === 'expense') {
        grouped[t.category] = (grouped[t.category] || 0) + t.amount;
      }
    });
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="animate-in">
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <h1 className="tracking-tight" style={{ marginBottom: '0.25rem' }}>Hello Alex,</h1>
          <p style={{ fontSize: '1rem', fontWeight: 500 }}>Welcome back! Here's your financial snapshot for <span style={{ color: 'var(--primary)', fontWeight: 700 }}>Zorvyn</span>.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem', background: 'var(--bg-card)', padding: '0.5rem', borderRadius: '18px', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow)' }}>
          {(['week', 'month', 'year'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeFrame(tf)}
              className={`btn ${timeFrame === tf ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '0.5rem 1rem', borderRadius: '12px', border: 'none', boxShadow: timeFrame === tf ? '0 4px 12px rgba(79, 70, 229, 0.3)' : 'none' }}
            >
              {tf.charAt(0).toUpperCase() + tf.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid-cards">
        {/* Balance Card */}
        <div className="glass-card" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: 'white', border: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', padding: '0.75rem', borderRadius: '14px' }}>
              <Wallet size={24} color="white" />
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>Total Balance</p>
              <h2 style={{ color: 'white', margin: 0, fontSize: '1.75rem' }}>₹{totals.balance.toLocaleString()}</h2>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', background: 'rgba(255,255,255,0.15)', padding: '0.375rem 0.75rem', borderRadius: '10px' }}>Alex Rivera</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', fontWeight: 600 }}>
              <ArrowUpRight size={16} /> <span style={{ color: 'white' }}>+4.2%</span>
            </div>
          </div>
        </div>

        {/* Income Card */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.875rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '16px' }}>
              <TrendingUp size={28} />
            </div>
            <div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Income</p>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>₹{totals.income.toLocaleString()}</h2>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontSize: '0.875rem', fontWeight: 600 }}>
            <ArrowUpRight size={16} /> <span>12% Inc. vs last period</span>
          </div>
        </div>

        {/* Expense Card */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.875rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '16px' }}>
              <CreditCard size={28} />
            </div>
            <div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Expenses</p>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>₹{totals.expense.toLocaleString()}</h2>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', fontSize: '0.875rem', fontWeight: 600 }}>
            <ArrowDownRight size={16} /> <span>5.4% Dec. vs last period</span>
          </div>
        </div>

        {/* Savings Card */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '0.875rem', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', borderRadius: '16px' }}>
              <PiggyBank size={28} />
            </div>
            <div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Savings Rate</p>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{savingsRate}%</h2>
            </div>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(savingsRate, 100)}%`, height: '100%', background: 'var(--warning)', borderRadius: '4px' }} />
          </div>
        </div>
      </div>

      <div className="grid-charts">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* CASH FLOW TREND */}
          <div className="glass-card" style={{ minHeight: '420px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h3 style={{ margin: 0 }}>Cash Flow Trend</h3>
                <p className="text-xs">Visualising your income vs expenses</p>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 12, height: 12, borderRadius: '4px', background: 'var(--success)' }} />
                  <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>INCOME</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 12, height: 12, borderRadius: '4px', background: 'var(--danger)' }} />
                  <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>EXPENSE</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--success)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--danger)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 500 }} dx={-10} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', boxShadow: 'var(--card-shadow)', padding: '1rem' }}
                />
                <Area type="monotone" dataKey="income" stroke="var(--success)" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={4} />
                <Area type="monotone" dataKey="expense" stroke="var(--danger)" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <SmartInsights />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <HealthScore score={healthScore} />
          
          <div className="glass-card">
            <h3 style={{ marginBottom: '1.5rem' }}>Distribution</h3>
            <div style={{ position: 'relative' }}>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={8}
                    dataKey="value"
                    onClick={(data: any) => {
                      setSearchTerm(data.name);
                      setCurrentTab('transactions');
                    }}
                    cursor="pointer"
                    stroke="none"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                <p className="text-xs font-bold" style={{ color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Expense</p>
                <h4 style={{ margin: 0, fontSize: '1.25rem' }}>Categorised</h4>
              </div>
            </div>
            
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {categoryData.slice(0, 4).map((item, index) => (
                <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '4px', background: COLORS[index % COLORS.length] }} />
                    <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: '0.9375rem', fontWeight: 700 }}>₹{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};