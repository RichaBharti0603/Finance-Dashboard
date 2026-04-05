import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, Cell
} from 'recharts';
import { 
  TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, 
  Target, Zap, Activity, Flame
} from 'lucide-react';
import { 
  calculateTotals, getNetWorthTrend, getSpendingVelocity, 
  getSavingsRate, getPeriodComparison, calculateHealthScore,
  getTopCategory, getCategoryBreakdown
} from '../utils/financeUtils';
import { HealthScore } from '../components/HealthScore';

export const Dashboard: React.FC = () => {
  const { transactions, goals, setCurrentTab, setSearchTerm } = useFinance();

  const totals = useMemo(() => calculateTotals(transactions), [transactions]);
  const netWorthTrend = useMemo(() => getNetWorthTrend(transactions), [transactions]);
  const velocity = useMemo(() => getSpendingVelocity(transactions), [transactions]);
  const savingsRate = useMemo(() => getSavingsRate(transactions), [transactions]);
  const comparison = useMemo(() => getPeriodComparison(transactions), [transactions]);
  const healthScore = useMemo(() => calculateHealthScore(transactions), [transactions]);
  const topCategory = useMemo(() => getTopCategory(transactions), [transactions]);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="animate-in">
      {/* HEADER SECTION */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="tracking-tight" style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Zorvyn Overview</h1>
        <p className="text-secondary" style={{ fontWeight: 500 }}>
          Your financial ecosystem is <span style={{ color: 'var(--success)', fontWeight: 700 }}>{healthScore > 70 ? 'Excellent' : 'Stable'}</span>. 
          {comparison.percentChange > 0 ? ` Expenses are up ${comparison.percentChange}% this month.` : ` Spending is down ${Math.abs(comparison.percentChange)}% compared to last period.`}
        </p>
      </div>

      {/* KPI GRID */}
      <div className="grid-cards">
        {/* Total Balance / Net Worth */}
        <div className="glass-card" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: 'white', border: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.75rem', borderRadius: '16px' }}>
              <Wallet size={24} />
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Net Liquidity</p>
              <h2 style={{ color: 'white', fontSize: '1.875rem', margin: 0 }}>₹{totals.balance.toLocaleString()}</h2>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', padding: '0.5rem 0.75rem', borderRadius: '12px', width: 'fit-content' }}>
            <Activity size={14} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Active Portfolio</span>
          </div>
        </div>

        {/* Spending Velocity */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '14px' }}>
              <Flame size={20} />
            </div>
            <div>
              <p className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>BURN RATE</p>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>₹{velocity.toLocaleString()}<small>/day</small></h3>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: comparison.percentChange > 0 ? 'var(--danger)' : 'var(--success)', fontSize: '0.75rem', fontWeight: 700 }}>
            {comparison.percentChange > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span>{Math.abs(comparison.percentChange)}% vs last month</span>
          </div>
        </div>

        {/* Savings Rate */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '14px' }}>
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>SAVINGS RATE</p>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{savingsRate}%</h3>
            </div>
          </div>
          <div className="progress-container" style={{ margin: '0.5rem 0' }}>
            <div className="progress-fill" style={{ width: `${Math.min(savingsRate, 100)}%`, background: 'var(--success)' }} />
          </div>
          <p className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>Target: 20%</p>
        </div>

        {/* Top category Card */}
        <div className="glass-card" onClick={() => { if(topCategory) { setSearchTerm(topCategory[0]); setCurrentTab('transactions'); } }} style={{ cursor: 'pointer' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', borderRadius: '14px' }}>
              <Zap size={20} />
            </div>
            <div>
              <p className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>TOP CATEGORY</p>
              <h3 style={{ margin: 0, fontSize: '1.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{topCategory ? topCategory[0] : 'None'}</h3>
            </div>
          </div>
          <p className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>₹{topCategory ? topCategory[1].toLocaleString() : 0} spent total</p>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid-charts">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* NET WORTH TREND CHART */}
          <div className="glass-card" style={{ height: '400px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
              <div>
                <h3 style={{ margin: 0 }}>Net Worth Progression</h3>
                <p className="text-xs font-bold" style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Cumulative Portfolio Balance</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-income" style={{ borderRadius: '12px' }}>LIFETIME TREND</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={netWorthTrend}>
                <defs>
                   <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 600 }} tickFormatter={(val) => `₹${val/1000}k`} dx={-10} />
                <Tooltip 
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', boxShadow: 'var(--card-shadow)', padding: '1rem' }}
                  formatter={(val: any) => [`₹${val?.toLocaleString()}`, 'Balance']}
                />
                <Area type="monotone" dataKey="balance" stroke="var(--primary)" fillOpacity={1} fill="url(#colorBalance)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
             {/* GOAL TRACKER */}
             <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>Active Goals</h3>
                <Target size={18} color="var(--primary)" />
              </div>
              {goals.map(goal => (
                <div key={goal.id} style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="text-sm font-bold">{goal.name}</span>
                    <span className="text-sm font-bold" style={{ color: 'var(--primary)' }}>{Math.round((goal.currentAmount/goal.targetAmount)*100)}%</span>
                  </div>
                  <div className="progress-container" style={{ margin: 0 }}>
                    <div className="progress-fill" style={{ width: `${(goal.currentAmount/goal.targetAmount)*100}%`, background: 'var(--primary)' }} />
                  </div>
                  <p className="text-xs" style={{ marginTop: '0.25rem' }}>₹{goal.currentAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}</p>
                </div>
              ))}
            </div>
            
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'var(--bg-color)' }}>
               <div style={{ padding: '1.5rem', background: 'var(--bg-card)', borderRadius: '24px', color: 'var(--primary)' }}>
                  <Activity size={32} />
               </div>
               <div>
                  <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Anomaly Detection</h3>
                  <p className="text-xs" style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>AI scanning for unusual spending patterns...</p>
                  <span className="badge badge-income" style={{ marginTop: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>All Stable</span>
               </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
           <HealthScore score={healthScore} />

           <div className="glass-card">
              <h3 style={{ marginBottom: '1.5rem' }}>Category Mix</h3>
              <ResponsiveContainer width="100%" height={200}>
                 <BarChart data={Object.entries(getCategoryBreakdown(transactions)).map(([name, value]) => ({ name, value })).slice(0, 4)}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} height={40} />
                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                       {Object.entries(getCategoryBreakdown(transactions)).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                 {Object.entries(getCategoryBreakdown(transactions)).sort((a,b) => (b[1] as number) - (a[1] as number)).slice(0, 3).map(([name, value], i) => (
                    <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: 8, height: 8, borderRadius: '2px', background: COLORS[i % COLORS.length] }} />
                          <span className="text-sm font-bold">{name}</span>
                       </div>
                       <span className="text-sm font-bold">₹{(value as number).toLocaleString()}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};