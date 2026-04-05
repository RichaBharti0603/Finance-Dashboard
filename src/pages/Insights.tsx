import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  XAxis, YAxis, Tooltip, ResponsiveContainer, 
  AreaChart, Area, CartesianGrid
} from 'recharts';
import { 
  AlertTriangle, Sparkles, 
  ArrowRight, Brain, Zap
} from 'lucide-react';
import { 
  getCategoryBreakdown, getAnomalies, predictNextMonth,
  getTopCategory, calculateTotals, getSubscriptions
} from '../utils/financeUtils';
import { format, parseISO, getDay, subMonths, startOfMonth, isWithinInterval, endOfMonth } from 'date-fns';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const Insights: React.FC = () => {
  const { transactions } = useFinance();

  const anomalies = useMemo(() => getAnomalies(transactions), [transactions]);
  const forecast = useMemo(() => predictNextMonth(transactions), [transactions]);
  const subscriptions = useMemo(() => getSubscriptions(transactions), [transactions]);

  // HEATMAP DATA (Day of Week)
  const heatmapData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = new Array(7).fill(0);
    transactions.forEach(t => {
      if (t.type === 'expense') counts[getDay(parseISO(t.date))] += t.amount;
    });
    return counts.map((val, i) => ({ day: days[i], value: val }));
  }, [transactions]);

  // MONTHLY BREAKDOWN (Last 4 Months)
  const monthlyTrends = useMemo(() => {
     return [3, 2, 1, 0].map(m => {
        const start = startOfMonth(subMonths(new Date(), m));
        const end = endOfMonth(subMonths(new Date(), m));
        const filtered = transactions.filter(t => isWithinInterval(parseISO(t.date), { start, end }));
        const { income, expense } = calculateTotals(filtered);
        return {
           name: format(start, 'MMM'),
           income,
           expense
        };
     });
  }, [transactions]);

  const weekendVsWeekday = useMemo(() => {
     let weekend = 0, weekday = 0;
     transactions.forEach(t => {
        if(t.type === 'expense') {
           const d = getDay(parseISO(t.date));
           if (d === 0 || d === 6) weekend += t.amount;
           else weekday += t.amount;
        }
     });
     return { weekend, weekday };
  }, [transactions]);

  if (transactions.length === 0) return (
     <div style={{ textAlign: 'center', marginTop: '10rem' }}>
        <Brain size={64} style={{ color: 'var(--text-secondary)', opacity: 0.2 }} />
        <h2 style={{ marginTop: '1.5rem' }}>Awaiting Analytical Data...</h2>
        <p className="text-secondary">Execute a few transactions to activate the Zorvyn AI engine.</p>
     </div>
  );

  return (
    <div className="animate-in">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="tracking-tight" style={{ margin: 0 }}>Intelligence</h1>
        <p className="text-sm font-bold" style={{ color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Predictive Analytics Engine</p>
      </div>

      <div className="grid-charts">
         <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* MONTHLY TRENDS AREA CHART */}
            <div className="glass-card" style={{ height: '360px' }}>
               <h3 style={{ marginBottom: '2rem' }}>Flow Analysis</h3>
               <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={monthlyTrends}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700 }} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                     <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: 'var(--card-shadow)' }} />
                     <Area type="monotone" dataKey="income" stroke="#10b981" fill="#10b981" fillOpacity={0.05} strokeWidth={3} />
                     <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="#ef4444" fillOpacity={0.05} strokeWidth={3} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>

            {/* AI-LIKE INSIGHTS & ANOMALIES */}
            <div className="grid-cards" style={{ gridTemplateColumns: '1fr 1fr' }}>
               <div className="glass-card" style={{ borderLeft: '6px solid var(--primary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                     <Sparkles size={24} color="var(--primary)" />
                     <h3 style={{ margin: 0, fontSize: '1rem' }}>Smart Detection</h3>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                     <li style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        <ArrowRight size={14} style={{ marginRight: '0.5rem' }} /> 
                        Your weekend spending is <strong>₹{weekendVsWeekday.weekend.toLocaleString()}</strong>.
                     </li>
                     <li style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        <ArrowRight size={14} style={{ marginRight: '0.5rem' }} /> 
                        Top expense: <strong>{getTopCategory(transactions)?.[0]}</strong>.
                     </li>
                     <li style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        <ArrowRight size={14} style={{ marginRight: '0.5rem' }} /> 
                        Burn rate is <strong>₹{Math.round(calculateTotals(transactions).expense / 30).toLocaleString()}/day</strong>.
                     </li>
                  </ul>
               </div>

               <div className="glass-card" style={{ borderLeft: '6px solid var(--danger)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                     <AlertTriangle size={24} color="var(--danger)" />
                     <h3 style={{ margin: 0, fontSize: '1rem' }}>Anomalies</h3>
                  </div>
                  {anomalies.length > 0 ? (
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {anomalies.map(a => (
                           <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span className="text-xs font-bold">{a.description || a.category}</span>
                              <span className="badge badge-expense">₹{a.amount.toLocaleString()}</span>
                           </div>
                        ))}
                        <p className="text-xs text-secondary mt-2">These expenses exceed cat. averages by 2x.</p>
                     </div>
                  ) : (
                     <p className="text-sm font-bold text-secondary">No significant anomalies detected in recent cycles.</p>
                  )}
               </div>
            </div>
         </div>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* HEATMAP / DAY OF WEEK SPENDING */}
            <div className="glass-card">
               <h3 style={{ marginBottom: '1.5rem' }}>Heatmap <small className="text-secondary">(DOW)</small></h3>
               <div className="heatmap-grid" style={{ marginBottom: '1rem' }}>
                  {heatmapData.map(d => {
                     const max = Math.max(...heatmapData.map(x => x.value)) || 1;
                     const intensity = d.value / max;
                     return (
                        <div key={d.day} className="heatmap-cell" 
                             style={{ background: intensity > 0 ? `rgba(79, 70, 229, ${0.1 + intensity * 0.7})` : 'var(--bg-color)' }}
                             title={`${d.day}: ₹${d.value.toLocaleString()}`}
                        />
                     );
                  })}
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  {heatmapData.map(d => <span key={d.day} className="text-xs font-bold text-secondary" style={{ width: '100%', textAlign: 'center' }}>{d.day}</span>)}
               </div>
            </div>

            {/* FORECAST & SUBSCRIPTIONS */}
            <div className="glass-card" style={{ background: 'var(--bg-color)', borderStyle: 'dashed', borderWidth: '2px', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                   <div style={{ padding: '0.75rem', background: 'var(--bg-card)', borderRadius: '12px' }}><Zap size={20} color="var(--primary)" /></div>
                   <h3 style={{ margin: 0, fontSize: '1rem' }}>AI Forecast</h3>
                </div>
                <p className="text-secondary text-sm" style={{ marginBottom: '1.5rem' }}>Based on your last 3 months of data, Zorvyn predicts your next cycle expenditure will be:</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                   <h2 style={{ fontSize: '2rem', margin: 0 }}>₹{forecast.toLocaleString()}</h2>
                   <span className="text-xs font-bold text-secondary">PROJECTED</span>
                </div>
            </div>

            <div className="glass-card">
               <h3 style={{ marginBottom: '1.5rem' }}>Subscriptions</h3>
               {subscriptions.length > 0 ? (
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
               ) : (
                  <p className="text-xs text-secondary">No recurring subscriptions identified yet.</p>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};
