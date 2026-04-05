import React from 'react';
import { Activity, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const HealthScore: React.FC<{ score?: number }> = ({ score: propScore }) => {
  const score = propScore ?? 72;
  const radius = 50;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = 'var(--success)';
  if (score < 50) color = 'var(--danger)';
  else if (score < 80) color = 'var(--warning)';

  return (
    <div className="glass-card" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <Activity color="var(--primary)" size={24} />
        <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Financial Health</h3>
      </div>
      
      <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        {/* Circular Progress */}
        <div style={{ position: 'relative', width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <svg
            height={radius * 2}
            width={radius * 2}
            style={{ transform: 'rotate(-90deg)' }}
          >
            {/* Background circle */}
            <circle
              stroke="var(--border-color)"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {/* Progress circle */}
            <circle
              stroke={color}
              fill="transparent"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset, transition: 'stroke-dashoffset 1.5s ease-in-out' }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
          </svg>
          
          <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>out of 100</span>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ 
            display: 'inline-block',
            padding: '0.5rem 1rem', 
            borderRadius: '20px', 
            background: 'rgba(245, 158, 11, 0.1)', 
            color: 'var(--warning, #f59e0b)',
            fontWeight: 500,
            margin: '0 0 1.5rem 0',
            fontSize: '0.9rem'
          }}>
            Good, but overspending on leisure
          </p>
        </div>

        <div style={{ width: '100%', marginTop: 'auto' }}>
          <h4 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Score Factors
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="var(--success)" /> Income Stability
              </span>
              <span style={{ fontWeight: 600 }}>Excellent</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={16} color="var(--success)" /> Savings Ratio
              </span>
              <span style={{ fontWeight: 600 }}>Good</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} color="var(--warning)" /> Expense Consistency
              </span>
              <span style={{ fontWeight: 600 }}>Needs Work</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
