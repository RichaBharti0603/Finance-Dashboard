import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, Cell
} from 'recharts';
import { 
  Target, Zap
} from 'lucide-react';
import { 
  calculateTotals, getNetWorthTrend, 
  getSavingsRate, getPeriodComparison, calculateHealthScore,
  getTopCategory, getCategoryBreakdown, getSpendingTier
} from '../utils/financeUtils';
import { HealthScore } from '../components/HealthScore';
import { format, parseISO } from 'date-fns';
import { PageTransition, StaggerContainer, StaggerItem } from '../components/MotionWrappers';
import { MoneyEffect } from '../components/MoneyEffect';
import { SkeletonCardSnippet } from '../components/Skeleton';

export const Dashboard: React.FC = () => {
  const { transactions, goals, setCurrentTab } = useFinance();

  const totals = useMemo(() => calculateTotals(transactions), [transactions]);
  const netWorthTrend = useMemo(() => getNetWorthTrend(transactions), [transactions]);
  const savingsRate = useMemo(() => getSavingsRate(transactions), [transactions]);
  const comparison = useMemo(() => getPeriodComparison(transactions), [transactions]);
  const healthScore = useMemo(() => calculateHealthScore(transactions), [transactions]);
  const topCategory = useMemo(() => getTopCategory(transactions), [transactions]);
  const spendingTier = useMemo(() => getSpendingTier(transactions), [transactions]);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (transactions.length === 0) {
    return (
      <div className="animate-in" style={{ padding: '2rem' }}>
        <SkeletonCardSnippet />
      </div>
    );
  }

  return (
    <PageTransition>
      <MoneyEffect />
      {/* KPI GRID (Hero Section) */}
      <StaggerContainer>
        <div className="grid-cards" style={{ marginBottom: '2.5rem' }}>
          <StaggerItem index={0}>
            <div className="glass-card" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: 'white', border: 'none' }}>
              <p className="text-xs font-bold" style={{ opacity: 0.8, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Liquidity</p>
              <h2 style={{ fontSize: '2rem', margin: 0 }}>₹{totals.balance.toLocaleString()}</h2>
            </div>
          </StaggerItem>
          <StaggerItem index={1}>
            <div className="glass-card">
              <p className="text-xs font-bold text-secondary" style={{ textTransform: 'uppercase', marginBottom: '0.5rem' }}>Burn Status</p>
              <h3 style={{ margin: 0, color: spendingTier.color }}>{spendingTier.label}</h3>
            </div>
          </StaggerItem>
          <StaggerItem index={2}>
            <div className="glass-card">
              <p className="text-xs font-bold text-secondary" style={{ textTransform: 'uppercase', marginBottom: '0.5rem' }}>Savings Rate</p>
              <h3 style={{ margin: 0 }}>{savingsRate}%</h3>
            </div>
          </StaggerItem>
          <StaggerItem index={3}>
            <div className="glass-card">
              <p className="text-xs font-bold text-secondary" style={{ textTransform: 'uppercase', marginBottom: '0.5rem' }}>Top Segment</p>
              <h3 style={{ margin: 0 }}>{topCategory ? topCategory[0] : 'None'}</h3>
            </div>
          </StaggerItem>
        </div>

        <div className="dashboard-main">
          {/* LEFT COLUMN: VISUALS (Charts) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <StaggerItem index={4}>
              <div className="glass-card" style={{ padding: '2rem' }}>
                 <h3 style={{ marginBottom: '2rem' }}>Portfolio Progression</h3>
                 <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={netWorthTrend}>
                       <defs>
                          <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                             <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                       <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} />
                       <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} tickFormatter={(val) => `₹${val/1000}k`} />
                       <Tooltip 
                          contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px' }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                               const d = payload[0].payload;
                               return (
                                 <div className="glass-card" style={{ padding: '1rem', border: '1px solid var(--primary)' }}>
                                   <p className="text-xs font-bold text-secondary">{d.label}</p>
                                   <p className="font-bold" style={{ fontSize: '1.25rem' }}>₹{d.balance.toLocaleString()}</p>
                                 </div>
                               );
                            }
                            return null;
                          }}
                       />
                       <Area type="monotone" dataKey="balance" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" isAnimationActive={true} animationDuration={1500} />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
            </StaggerItem>

            <StaggerItem index={5}>
              <div className="glass-card" style={{ padding: '2rem' }}>
                 <h3 style={{ marginBottom: '2rem' }}>Category Mix</h3>
                 <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={Object.entries(getCategoryBreakdown(transactions)).map(([name, value]) => ({ name, value })).slice(0, 5)}>
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} height={40} />
                       <Tooltip 
                          cursor={{ fill: 'var(--bg-hover)' }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                               const d = payload[0].payload;
                               return (
                                 <div className="glass-card" style={{ padding: '0.75rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                                    <p className="text-xs font-bold">{d.name}</p>
                                    <p className="font-bold" style={{ color: payload[0].fill }}>₹{d.value.toLocaleString()}</p>
                                 </div>
                               );
                            }
                            return null;
                          }}
                       />
                       <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive={true}>
                          {Object.entries(getCategoryBreakdown(transactions)).map((_, index) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
            </StaggerItem>
          </div>

          {/* RIGHT COLUMN: INTELLIGENCE (Score + Insights) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             <StaggerItem index={6}><HealthScore score={healthScore} /></StaggerItem>
             
             <StaggerItem index={7}>
               <div className="glass-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                     <h3 style={{ margin: 0, fontSize: '1rem' }}>AI Spending Tiers</h3>
                     <Zap size={18} color="var(--primary)" />
                  </div>
                  <div style={{ padding: '1rem', background: 'var(--bg-color)', borderRadius: '16px', borderLeft: `4px solid ${spendingTier.color}` }}>
                     <h4 style={{ margin: 0, color: spendingTier.color, fontSize: '1.25rem' }}>{spendingTier.label}</h4>
                     <p className="text-xs font-bold" style={{ marginTop: '0.5rem', opacity: 0.7 }}>
                       {comparison.percentChange > 0 
                         ? `Expenditure up ₹${comparison.diff.toLocaleString()}.`
                         : `Savings up ₹${Math.abs(comparison.diff).toLocaleString()}.`}
                     </p>
                  </div>
               </div>
             </StaggerItem>

             <StaggerItem index={8}>
               <div className="glass-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                     <h3 style={{ margin: 0, fontSize: '1rem' }}>Target Progress</h3>
                     <Target size={18} color="var(--primary)" />
                  </div>
                  {goals.map(goal => (
                     <div key={goal.id} style={{ marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                           <span className="text-sm font-bold">{goal.name}</span>
                        </div>
                        <div className="progress-container" style={{ margin: 0 }}>
                           <div className="progress-fill" style={{ width: `${(goal.currentAmount/goal.targetAmount)*100}%`, background: 'var(--primary)' }} />
                        </div>
                     </div>
                  ))}
               </div>
             </StaggerItem>
          </div>
        </div>

        {/* BOTTOM SECTION: TRANSACTIONS (Recent Activity Ledger) */}
        <StaggerItem index={9}>
          <div style={{ marginTop: '3rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>Recent Activity</h3>
                <button 
                  onClick={() => setCurrentTab('transactions')}
                  style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 800, fontSize: '0.8125rem', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                >
                  View Full Ledger →
                </button>
             </div>
             <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                   <thead>
                      <tr>
                         <th style={{ textAlign: 'left', padding: '1.25rem' }}>DATE</th>
                         <th style={{ textAlign: 'left', padding: '1.25rem' }}>DESCRIPTION</th>
                         <th style={{ textAlign: 'left', padding: '1.25rem' }}>CATEGORY</th>
                         <th style={{ textAlign: 'right', padding: '1.25rem' }}>AMOUNT</th>
                      </tr>
                   </thead>
                   <tbody>
                     {transactions.slice(0, 5).map(t => (
                       <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                         <td style={{ padding: '1.25rem', fontSize: '0.875rem', fontWeight: 600 }}>{format(parseISO(t.date), 'MMM dd')}</td>
                         <td style={{ padding: '1.25rem', fontSize: '0.875rem', fontWeight: 700 }}>{t.description || '-'}</td>
                         <td style={{ padding: '1.25rem', fontSize: '0.875rem' }}><span className="badge" style={{ background: 'var(--bg-color)', color: 'var(--text-secondary)', fontWeight: 800, fontSize: '10px' }}>{t.category.toUpperCase()}</span></td>
                         <td style={{ padding: '1.25rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: 800, color: t.type === 'income' ? 'var(--success)' : 'var(--text-main)' }}>
                            {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                </table>
             </div>
          </div>
        </StaggerItem>
      </StaggerContainer>
    </PageTransition>
  );
};