import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  LayoutDashboard, ReceiptText, LineChart, Moon, Sun, 
  ShieldCheck, ArrowRightLeft, CreditCard, Settings, LogOut,
  Zap
} from 'lucide-react';
import clsx from 'clsx';
import type { Tab } from '../types';

export const Sidebar: React.FC = () => {
  const { currentRole, theme, toggleTheme, currentTab, setCurrentTab } = useFinance();

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ReceiptText },
    { id: 'insights', label: 'Insights', icon: LineChart },
  ];

  return (
    <div className="sidebar">
      {/* BRANDING */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ 
          width: 44, height: 44, borderRadius: '14px', 
          background: 'linear-gradient(135deg, var(--primary) 0%, #a855f7 100%)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          color: 'white', box_shadow: '0 8px 16px rgba(79, 70, 229, 0.25)' 
        }}>
          <Zap size={24} fill="white" />
        </div>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-main)' }}>
          Zorvyn
        </h2>
      </div>

      {/* USER PROFILE */}
      <div style={{ 
        marginBottom: '2rem', padding: '1rem', borderRadius: '20px', 
        background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border-color)',
        display: 'flex', alignItems: 'center', gap: '1rem' 
      }}>
        <div className="avatar">AR</div>
        <div style={{ overflow: 'hidden' }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9375rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>Alex Rivera</p>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Financial Manager</p>
        </div>
      </div>

      {/* SEARCH / QUICK NAV (Visual only) */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p className="text-xs font-bold" style={{ textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Menu</p>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id as Tab)}
              className={clsx('nav-link', { active: currentTab === item.id })}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <p className="text-xs font-bold" style={{ textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Other</p>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <button className="nav-link"><Settings size={20} /> Settings</button>
          <button className="nav-link"><LogOut size={20} /> Log out</button>
        </nav>
      </div>

      <div className="spacer"></div>

      {/* FOOTER CONTROLS */}
      <div style={{ padding: '1.25rem 0', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShieldCheck size={18} color="var(--primary)" />
            <span className="text-sm font-bold">{currentRole === 'admin' ? 'Admin Mode' : 'View Only'}</span>
          </div>
          <button 
            className="btn-icon" 
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};
