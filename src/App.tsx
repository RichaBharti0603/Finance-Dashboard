import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Insights } from './pages/Insights';

const AppContent: React.FC = () => {
  const { currentTab } = useFinance();

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        {currentTab === 'dashboard' && <Dashboard />}
        {currentTab === 'transactions' && <Transactions />}
        {currentTab === 'insights' && <Insights />}
      </main>
    </div>
  );
};

function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}

export default App;