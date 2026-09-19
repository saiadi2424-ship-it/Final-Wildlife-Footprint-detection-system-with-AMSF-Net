import React from 'react';
import { Sparkles, RefreshCw, AlertTriangle } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import ToggleSwitch from '../common/ToggleSwitch';

export default function Header() {
  const { activeTab, hardwareMode, setHardwareMode, pollHardware, refreshHealth } = useSystem();

  const tabTitles = {
    dashboard: 'System Overview & Live Dashboard',
    prediction: 'Wildlife Footprint Prediction Workspace',
    hardware: 'Raspberry Pi 3 Edge Acquisition Monitor',
    performance: 'AMSF-Net Model Performance & Research Metrics',
    amsf_arch: 'AMSF-Net Deep Learning Architecture',
    system_arch: 'End-to-End System & Edge Architecture',
    history: 'Wildlife Footprint Prediction History',
    about: 'About AMSF-Net Research Project',
  };

  const handleRefresh = () => {
    pollHardware();
    refreshHealth();
  };

  return (
    <header className="sticky top-0 z-20 bg-[#080c16]/90 backdrop-blur-md border-b border-indigo-950/70 px-6 py-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {tabTitles[activeTab] || 'Dashboard'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            AI-Based Wildlife Footprint Recognition using Adaptive Multi-Scale Feature Fusion Network
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ToggleSwitch mode={hardwareMode} onChange={setHardwareMode} />

          <button
            onClick={handleRefresh}
            title="Refresh telemetry"
            className="p-2 rounded-xl bg-slate-900/80 border border-indigo-900/40 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* High-visibility simulation mode warning banner */}
      {hardwareMode === 'demo' && (
        <div className="mt-3 py-2 px-3.5 bg-purple-950/60 border border-purple-700/50 rounded-lg flex items-center justify-between text-xs text-purple-200 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="font-semibold tracking-wide">
              SIMULATION MODE ACTIVE:
            </span>
            <span className="text-purple-300">
              Raspberry Pi hardware data is simulated for demonstration purposes.
            </span>
          </div>
          <button
            onClick={() => setHardwareMode('live')}
            className="text-xs text-white font-semibold underline hover:text-purple-100 ml-4 shrink-0"
          >
            Switch to Live Hardware
          </button>
        </div>
      )}
    </header>
  );
}
