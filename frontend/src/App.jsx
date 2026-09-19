import React, { useState } from 'react';
import { useSystem, SystemProvider } from './context/SystemContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardPage from './pages/DashboardPage';
import PredictionPage from './pages/PredictionPage';
import HardwareMonitorPage from './pages/HardwareMonitorPage';
import ModelPerformancePage from './pages/ModelPerformancePage';
import AMSFNetArchPage from './pages/AMSFNetArchPage';
import SystemArchPage from './pages/SystemArchPage';
import HistoryPage from './pages/HistoryPage';
import AboutPage from './pages/AboutPage';
import { Menu, X, CheckCircle, AlertCircle, Info } from 'lucide-react';

function MainLayout() {
  const { activeTab, toast } = useSystem();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'prediction':
        return <PredictionPage />;
      case 'hardware':
        return <HardwareMonitorPage />;
      case 'performance':
        return <ModelPerformancePage />;
      case 'amsf_arch':
        return <AMSFNetArchPage />;
      case 'system_arch':
        return <SystemArchPage />;
      case 'history':
        return <HistoryPage />;
      case 'about':
        return <AboutPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#080c16] text-slate-100 selection:bg-indigo-600 selection:text-white">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-72 h-full bg-[#0a0e1a]">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-[#0a0e1a] border-b border-indigo-950/70 sticky top-0 z-30">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-indigo-900/50 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-bold text-sm text-white">AMSF-Net Wildlife AI</span>
          <div className="w-9" />
        </div>

        <Header />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>

        {/* Global Toast Notification */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 animate-bounce">
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-xs font-semibold ${
                toast.type === 'success'
                  ? 'bg-emerald-950/95 border-emerald-700/80 text-emerald-200'
                  : toast.type === 'error'
                  ? 'bg-rose-950/95 border-rose-700/80 text-rose-200'
                  : 'bg-indigo-950/95 border-indigo-700/80 text-indigo-200'
              }`}
            >
              {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-indigo-400" />}
              <span>{toast.message}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SystemProvider>
      <MainLayout />
    </SystemProvider>
  );
}
