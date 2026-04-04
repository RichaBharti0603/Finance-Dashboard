import React, { useMemo, useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { format, parseISO, isAfter, subWeeks, subMonths, subYears } from 'date-fns';
import { SmartInsights } from '../components/SmartInsights';
import { HealthScore } from '../components/HealthScore';
import { InsightsPanel } from '../components/InsightsPanel';

// ✅ Strict type
type TrendItem = {
  date: string;
  income: number;
  expense: number;
  originalDate: string;
};

// ✅ Pie data type
type CategoryItem = {
  name: string;
  value: number;
};

export const Dashboard: React.FC = () => {
  const { transactions, setSearchTerm, setCurrentTab } = useFinance();

  const [timeFrame, setTimeFrame] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');

  // ✅ Filter
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const threshold =
      timeFrame === 'weekly'
        ? subWeeks(now, 1)
        : timeFrame === 'monthly'
        ? subMonths(now, 1)
        : subYears(now, 1);

    return transactions.filter((t) => isAfter(parseISO(t.date), threshold));
  }, [transactions, timeFrame]);

  // ✅ Totals
  const totalIncome = useMemo(
    () => filteredTransactions.filter(t => t.type === 'income')
      .reduce((a, c) => a + c.amount, 0),
    [filteredTransactions]
  );

  const totalExpense = useMemo(
    () => filteredTransactions.filter(t => t.type === 'expense')
      .reduce((a, c) => a + c.amount, 0),
    [filteredTransactions]
  );

  const totalBalance = totalIncome - totalExpense;

  // ✅ Trend Data
  const trendData = useMemo(() => {
    const grouped = filteredTransactions.reduce<Record<string, TrendItem>>((acc, t) => {
      const formatStr = timeFrame === 'yearly' ? 'MMM yyyy' : 'MMM dd';
      const dateStr = format(parseISO(t.date), formatStr);

      if (!acc[dateStr]) {
        acc[dateStr] = {
          date: dateStr,
          income: 0,
          expense: 0,
          originalDate: t.date
        };
      }

      acc[dateStr][t.type] += t.amount;
      return acc;
    }, {});

    return Object.values(grouped).sort(
      (a, b) => new Date(a.originalDate).getTime() - new Date(b.originalDate).getTime()
    );
  }, [filteredTransactions, timeFrame]);

  // ✅ Category Data
  const categoryData: CategoryItem[] = useMemo(() => {
    const grouped: Record<string, number> = {};

    filteredTransactions.forEach((t) => {
      if (t.type === 'expense') {
        grouped[t.category] = (grouped[t.category] || 0) + t.amount;
      }
    });

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  // ✅ Proper tooltip typing
  const CustomPieTooltip = ({
    active,
    payload
  }: {
    active?: boolean;
    payload?: { payload: CategoryItem }[];
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const count = filteredTransactions.filter(t => t.category === data.name).length;

      return (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          padding: '1rem',
          border: '1px solid var(--border-color)',
          borderRadius: '8px'
        }}>
          <p style={{ margin: 0, fontWeight: 600 }}>{data.name}</p>
          <p style={{ margin: 0 }}>₹{data.value.toLocaleString('en-IN')}</p>
          <small style={{ color: 'var(--primary)' }}>
            Click to view {count} transactions →
          </small>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-in">

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <h1>Zorvyn FinTech</h1>

        <div>
          {(['weekly', 'monthly', 'yearly'] as const).map((tf) => (
            <button key={tf} onClick={() => setTimeFrame(tf)}>
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* CARDS */}
      <div className="grid-cards">
        <div className="glass-card">₹{totalBalance.toLocaleString('en-IN')}</div>
        <div className="glass-card">₹{totalIncome.toLocaleString('en-IN')}</div>
        <div className="glass-card">₹{totalExpense.toLocaleString('en-IN')}</div>
      </div>

      {/* CHARTS */}
      <div className="grid-charts">

        {/* AREA */}
        <div className="glass-card">
          <ResponsiveContainer height={300}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area dataKey="income" stroke="#10b981" fill="#10b981" />
              <Area dataKey="expense" stroke="#ef4444" fill="#ef4444" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* PIE */}
        <div className="glass-card">
          <ResponsiveContainer height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                innerRadius={60}
                outerRadius={80}
                onClick={(data: CategoryItem) => {
                  setSearchTerm(data?.name ?? '');
                  setCurrentTab('transactions');
                }}
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip content={<CustomPieTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      <InsightsPanel />
    </div>
  );
};