import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { 
  LayoutDashboard, ReceiptText, LineChart, Moon, Sun, 
  ShieldCheck, CreditCard, Settings,
  Zap, Lock, Unlock
} from 'lucide-react';
import clsx from 'clsx';
import type { Tab } from '../types';

export const Sidebar: React.FC = () => {
  const { currentRole, setRole, theme, toggleTheme, currentTab, setCurrentTab } = useFinance();

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'transactions', label: 'Ledger', icon: ReceiptText },
    { id: 'insights', label: 'Intelligence', icon: LineChart },
  ];

  return (
    <div className="sidebar shadow-lg">
      {/* BRANDING */}
      <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ 
          width: 48, height: 48, borderRadius: '16px', 
          background: 'linear-gradient(135deg, var(--primary) 0%, #a855f7 100%)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          color: 'white', boxShadow: '0 8px 16px var(--ring)' 
        }}>
          <Zap size={24} fill="white" />
        </div>
        <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.04em' }}>
          Zorvyn
        </h2>
      </div>

      {/* USER PROFILE & ROLE STATUS */}
      <div style={{ 
        marginBottom: '2.5rem', padding: '1.25rem', borderRadius: '24px', 
        background: 'var(--bg-color)', border: '1px solid var(--border-color)',
        display: 'flex', alignItems: 'center', gap: '0.75rem'
      }}>
        <div style={{ 
          background: currentRole === 'admin' ? 'var(--primary)' : 'var(--text-secondary)',
          width: 48, height: 48, borderRadius: '14px', display: 'flex', 
          alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          {currentRole === 'admin' ? 'AR' : 'GS'}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <p className="text-sm font-bold" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {currentRole === 'admin' ? 'Alex Rivera' : 'Guest Session'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
             {currentRole === 'admin' ? <Unlock size={10} color="var(--success)" /> : <Lock size={10} color="var(--danger)" />}
             <p className="text-xs font-bold" style={{ textTransform: 'uppercase', opacity: 0.6 }}>{currentRole}</p>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <div style={{ marginBottom: '2rem' }}>
        <p className="text-xs font-bold text-secondary" style={{ textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.1em', paddingLeft: '0.5rem' }}>Portfolio</p>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id as Tab)}
              className={clsx('nav-link', { active: currentTab === item.id })}
              style={{ border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer' }}
            >
              <item.icon size={20} />
              <span className="font-bold">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div style={{ marginBottom: '2.5rem' }}>
        <p className="text-xs font-bold text-secondary" style={{ textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.1em', paddingLeft: '0.5rem' }}>Tools</p>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
           <button className="nav-link" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><CreditCard size={20} /><span className="font-bold">Cards</span></button>
           <button className="nav-link" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><Settings size={20} /><span className="font-bold">Settings</span></button>
        </nav>
      </div>

      <div style={{ flex: 1 }}></div>

      {/* FOOTER ACTIONS */}
      <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* THEME TOGGLE (PROMINENT) */}
        <button className="theme-switch" onClick={toggleTheme}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
             {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
             <span className="text-sm">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: theme === 'light' ? '#64748b' : '#fbbf24' }}></div>
        </button>

        {/* ROLE SWITCHER */}
        <div style={{ background: 'var(--bg-color)', borderRadius: '18px', padding: '0.25rem', border: '1px solid var(--border-color)', display: 'flex' }}>
           <button 
              onClick={() => setRole('admin')}
              style={{ 
                 flex: 1, padding: '0.75rem', borderRadius: '14px', fontSize: '0.75rem', fontWeight: 900, 
                 border: 'none', cursor: 'pointer', transition: '0.3s',
                 background: currentRole === 'admin' ? 'var(--primary)' : 'transparent',
                 boxShadow: currentRole === 'admin' ? '0 4px 12px var(--ring)' : 'none',
                 color: currentRole === 'admin' ? 'white' : 'var(--text-secondary)'
              }}
           >
              Admin
           </button>
           <button 
              onClick={() => setRole('viewer')}
              style={{ 
                 flex: 1, padding: '0.75rem', borderRadius: '14px', fontSize: '0.75rem', fontWeight: 900, 
                 border: 'none', cursor: 'pointer', transition: '0.3s',
                 background: currentRole === 'viewer' ? 'var(--primary)' : 'transparent',
                 boxShadow: currentRole === 'viewer' ? '0 4px 12px var(--ring)' : 'none',
                 color: currentRole === 'viewer' ? 'white' : 'var(--text-secondary)'
              }}
           >
              Viewer
           </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: 0.5 }}>
           <ShieldCheck size={14} color="var(--primary)" />
           <span className="text-xs font-bold tracking-widest">SECURE SESSION</span>
        </div>
      </div>
    </div>
  );
};
