import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { LayoutDashboard, ReceiptText, LineChart, Moon, Sun, Shield, ShieldAlert } from 'lucide-react';
import clsx from 'clsx';
import type { Tab } from '../types';

export const Sidebar: React.FC = () => {
  const { currentRole, setRole, theme, toggleTheme, currentTab, setCurrentTab } = useFinance();

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ReceiptText },
    { id: 'analytics', label: 'Insights', icon: LineChart },
  ];

  return (
    <div className="sidebar">
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
          <LineChart size={24} />
        </div>
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>FinDash</h2>
      </div>

      <nav style={{ flex: 1 }}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentTab(item.id as Tab)}
            className={clsx('nav-link', { active: currentTab === item.id })}
            style={{ width: '100%', textAlign: 'left', background: currentTab === item.id ? 'var(--bg-color)' : 'transparent', border: 'none' }}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <div style={{ padding: '1rem 0', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Role</span>
          <button 
            className="btn btn-outline" 
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
            onClick={() => setRole(currentRole === 'viewer' ? 'admin' : 'viewer')}
          >
            {currentRole === 'admin' ? <ShieldAlert size={14} /> : <Shield size={14} />}
            {currentRole === 'admin' ? 'Admin' : 'Viewer'}
          </button>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Theme</span>
          <button 
            className="btn-icon" 
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};
