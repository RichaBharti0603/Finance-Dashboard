import React, { useState } from 'react';
import { Sparkles, TrendingUp, Calendar, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';

interface InsightProps {
  icon: React.ReactNode;
  title: string;
  type: 'warning' | 'info' | 'success' | 'danger';
  whyText?: React.ReactNode;
}

const InsightCard: React.FC<InsightProps> = ({ icon, title, type, whyText }) => {
  const [expanded, setExpanded] = useState(false);

  const colors = {
    warning: { bg: 'rgba(245, 158, 11, 0.1)', text: 'var(--warning, #f59e0b)' },
    info: { bg: 'rgba(99, 102, 241, 0.1)', text: 'var(--primary, #6366f1)' },
    success: { bg: 'rgba(16, 185, 129, 0.1)', text: 'var(--success, #10b981)' },
    danger: { bg: 'rgba(239, 68, 68, 0.1)', text: 'var(--danger, #ef4444)' }
  };

  const style = colors[type];

  return (
    <div className="insight-card" style={{ 
      background: 'var(--bg-card)', 
      border: '1px solid var(--border-color)', 
      borderRadius: '12px',
      padding: '1rem',
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            padding: '0.75rem', 
            background: style.bg, 
            color: style.text, 
            borderRadius: '10px' 
          }}>
            {icon}
          </div>
          <p style={{ margin: 0, fontWeight: 500, color: 'var(--text-main)' }}>{title}</p>
        </div>
        
        {whyText && (
          <button 
            onClick={() => setExpanded(!expanded)}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = style.text;
              e.currentTarget.style.borderColor = style.text;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
          >
            Why? {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        )}
      </div>

      {expanded && whyText && (
        <div className="animate-in" style={{ 
          marginTop: '1rem', 
          paddingTop: '1rem', 
          borderTop: '1px dashed var(--border-color)',
          color: 'var(--text-secondary)',
          fontSize: '0.9rem'
        }}>
          {whyText}
        </div>
      )}
    </div>
  );
};

export const SmartInsights: React.FC = () => {
  return (
    <div className="glass-card" style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div className="animate-pulse">
          <Sparkles color="var(--primary)" size={24} />
        </div>
        <h3 style={{ margin: 0, fontSize: '1.25rem', background: 'linear-gradient(45deg, var(--primary), #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Smart Insights
        </h3>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <InsightCard 
          type="danger"
          icon={<TrendingUp size={20} />}
          title="You spent 32% more on Food this month"
          whyText={
            <div>
              <p style={{ margin: '0 0 0.5rem 0' }}>We noticed unusual spikes in food delivery apps compared to last month:</p>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <li><b>Zomato:</b> +₹2,400 (5 orders)</li>
                <li><b>Swiggy:</b> +₹1,800 (4 orders)</li>
                <li><b>Dining out:</b> Normal</li>
              </ul>
            </div>
          }
        />
        
        <InsightCard 
          type="info"
          icon={<Calendar size={20} />}
          title="Your highest expense day was March 18"
          whyText={
            <div>
              <p style={{ margin: 0 }}>You spent ₹14,500 on March 18. This was primarily driven by your annual car insurance renewal (₹12,000) and a grouped payment for utility bills (₹2,500).</p>
            </div>
          }
        />
        
        <InsightCard 
          type="warning"
          icon={<AlertCircle size={20} />}
          title="You are saving ₹5,200 less than last month"
          whyText={
            <div>
              <p style={{ margin: '0 0 0.5rem 0' }}>Your savings rate dropped from 25% to 18%. This is mainly because:</p>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <li>Increased Food expenses (up 32%)</li>
                <li>One-time tech purchase (Headphones - ₹4,000)</li>
              </ul>
            </div>
          }
        />
      </div>
    </div>
  );
};
