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
      <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ 
          width: 42, height: 42, borderRadius: '14px', 
          background: 'linear-gradient(135deg, var(--primary) 0%, #a855f7 100%)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          color: 'white', boxShadow: '0 8px 16px var(--ring)' 
        }}>
          <Zap size={22} fill="white" />
        </div>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
          Zorvyn
        </h2>
      </div>

      {/* USER PROFILE & ROLE STATUS */}
      <div style={{ 
        marginBottom: '2rem', padding: '1rem', borderRadius: '20px', 
        background: 'var(--bg-color)', border: '1px solid var(--border-color)',
        display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative'
      }}>
        <div style={{ 
          background: currentRole === 'admin' ? 'var(--primary)' : 'var(--text-secondary)',
          width: 44, height: 44, borderRadius: '12px', display: 'flex', 
          alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 
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
      <div style={{ marginBottom: '1.5rem' }}>
        <p className="text-xs font-bold text-secondary" style={{ textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Portfolio</p>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id as Tab)}
              className={clsx('nav-link', { active: currentTab === item.id })}
              style={{ border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer' }}
            >
              <item.icon size={18} />
              <span className="text-sm font-bold">{item.label}</span>
              {currentTab === item.id && <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: 'white' }} />}
            </button>
          ))}
        </nav>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <p className="text-xs font-bold text-secondary" style={{ textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>Management</p>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
           <button className="nav-link" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><CreditCard size={18} /><span className="text-sm font-bold">Banking</span></button>
           <button className="nav-link" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><Settings size={18} /><span className="text-sm font-bold">Settings</span></button>
        </nav>
      </div>

      <div style={{ flex: 1 }}></div>

      {/* LOWER FOOTER - ROLE & THEME */}
      <div style={{ padding: '1.5rem 0', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* ROLE SWITCHER */}
        <div className="input-group">
            <p className="text-xs font-bold text-secondary" style={{ marginBottom: '0.5rem', letterSpacing: '0.05em' }}>SESSION MODE</p>
            <div style={{ 
               display: 'flex', background: 'var(--bg-color)', 
               borderRadius: '12px', padding: '0.25rem', border: '1px solid var(--border-color)' 
            }}>
               <button 
                  onClick={() => setRole('admin')}
                  style={{ 
                     flex: 1, padding: '0.625rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800, 
                     border: 'none', cursor: 'pointer', transition: '0.2s',
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
                     flex: 1, padding: '0.625rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800, 
                     border: 'none', cursor: 'pointer', transition: '0.2s',
                     background: currentRole === 'viewer' ? 'var(--primary)' : 'transparent',
                     boxShadow: currentRole === 'viewer' ? '0 4px 12px var(--ring)' : 'none',
                     color: currentRole === 'viewer' ? 'white' : 'var(--text-secondary)'
                  }}
               >
                  Viewer
               </button>
            </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <ShieldCheck size={16} color="var(--primary)" />
             <span className="text-xs font-bold" style={{ opacity: 0.8 }}>ZORVYN-SECURE</span>
          </div>
          <button className="btn-icon" onClick={toggleTheme}>
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};
