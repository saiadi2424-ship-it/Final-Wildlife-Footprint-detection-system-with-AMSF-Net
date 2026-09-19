import React from 'react';
import {
  LayoutDashboard,
  PawPrint,
  Cpu,
  BarChart3,
  Network,
  GitFork,
  Clock,
  Info,
  Layers,
  CircleDot
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

export default function Sidebar() {
  const { activeTab, setActiveTab, apiHealth, hardwareTelemetry, hardwareMode } = useSystem();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'prediction', label: 'Footprint Prediction', icon: PawPrint },
    { id: 'hardware', label: 'Raspberry Pi Monitor', icon: Cpu },
    { id: 'performance', label: 'Model Performance', icon: BarChart3 },
    { id: 'amsf_arch', label: 'AMSF-Net Architecture', icon: Network },
    { id: 'system_arch', label: 'System Architecture', icon: GitFork },
    { id: 'history', label: 'Prediction History', icon: Clock },
    { id: 'about', label: 'About Project', icon: Info },
  ];

  const isHardwareConnected = hardwareMode === 'demo' 
    ? true 
    : hardwareTelemetry.device_status === 'CONNECTED';

  return (
    <aside className="w-72 bg-[#0a0e1a]/95 border-r border-indigo-950/70 flex flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-indigo-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white">
              <PawPrint className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight leading-none">AMSF-Net</h1>
              <p className="text-xs text-indigo-400 font-medium mt-1">Wildlife Footprint AI</p>
            </div>
          </div>

          {/* System Status Indicators */}
          <div className="mt-5 p-3 rounded-lg bg-slate-950/70 border border-indigo-950/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">AI ENGINE</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                ONLINE
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">API</span>
              <span className={`flex items-center gap-1.5 font-semibold ${apiHealth.status === 'online' ? 'text-emerald-400' : 'text-rose-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${apiHealth.status === 'online' ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                {apiHealth.status === 'online' ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">HARDWARE</span>
              <span className={`flex items-center gap-1.5 font-semibold ${isHardwareConnected ? (hardwareMode === 'demo' ? 'text-purple-400' : 'text-emerald-400') : 'text-amber-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isHardwareConnected ? (hardwareMode === 'demo' ? 'bg-purple-400' : 'bg-emerald-400') : 'bg-amber-400'}`}></span>
                {isHardwareConnected ? (hardwareMode === 'demo' ? 'SIMULATED' : 'CONNECTED') : 'WAITING'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white shadow-md shadow-indigo-600/20 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-indigo-950/60 text-xs text-slate-400">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-slate-300">Model Architecture</span>
          <span className="text-indigo-400 font-mono">AMSF-Net</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Classes</span>
          <span className="text-slate-300">Deer • Tiger • Wolf</span>
        </div>
      </div>
    </aside>
  );
}
