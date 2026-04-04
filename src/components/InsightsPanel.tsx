import React from 'react';
import { TrendingUp, Calendar, CreditCard } from 'lucide-react';

export const InsightsPanel: React.FC = () => {
    return (
        <div className="glass-card" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>Quick Insights</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '1rem', 
                    padding: '1.25rem', 
                    background: 'var(--bg-color)', 
                    borderRadius: '12px', 
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}>
                    <div style={{ color: 'var(--danger)', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '10px' }}>
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <p style={{ margin: 0, fontWeight: 500, color: 'var(--text-main)', lineHeight: 1.4 }}>
                            Your food spending increased by <span style={{ color: 'var(--danger)', fontWeight: 600 }}>28%</span> this month
                        </p>
                    </div>
                </div>

                <div style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '1rem', 
                    padding: '1.25rem', 
                    background: 'var(--bg-color)', 
                    borderRadius: '12px', 
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}>
                    <div style={{ color: 'var(--warning)', padding: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '10px' }}>
                        <Calendar size={20} />
                    </div>
                    <div>
                        <p style={{ margin: 0, fontWeight: 500, color: 'var(--text-main)', lineHeight: 1.4 }}>
                            You spent <span style={{ color: 'var(--warning)', fontWeight: 600 }}>₹2,300</span> more on weekends
                        </p>
                    </div>
                </div>

                <div style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '1rem', 
                    padding: '1.25rem', 
                    background: 'var(--bg-color)', 
                    borderRadius: '12px', 
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}>
                    <div style={{ color: 'var(--primary)', padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '10px' }}>
                        <CreditCard size={20} />
                    </div>
                    <div>
                        <p style={{ margin: 0, fontWeight: 500, color: 'var(--text-main)', lineHeight: 1.4 }}>
                            Subscriptions are <span style={{ color: 'var(--primary)', fontWeight: 600 }}>18%</span> of your expenses
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};
