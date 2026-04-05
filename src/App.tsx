import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Insights } from './pages/Insights';
import { useFinance, FinanceProvider } from './context/FinanceContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useFinance();

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type === 'success' && <CheckCircle2 size={20} color="var(--success)" />}
          {t.type === 'error' && <AlertCircle size={20} color="var(--danger)" />}
          {t.type === 'info' && <Info size={20} color="var(--primary)" />}
          <span style={{ flex: 1 }}>{t.message}</span>
          <button 
            onClick={() => removeToast(t.id)} 
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};

const Layout: React.FC = () => {
  const { currentTab, theme, currentRole } = useFinance();

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="app-container" data-theme={theme} data-role={currentRole} style={{ display: 'flex', width: '100%' }}>
      <Sidebar />
      <main className="main-content">
        {currentTab === 'dashboard' && <Dashboard />}
        {currentTab === 'transactions' && <Transactions />}
        {currentTab === 'insights' && <Insights />}
      </main>
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <Layout />
    </FinanceProvider>
  );
}