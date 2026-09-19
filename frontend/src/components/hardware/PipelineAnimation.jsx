import React from 'react';
import {
  Cpu,
  Camera,
  FileImage,
  Terminal,
  Server,
  Network,
  CheckCircle2,
  LayoutDashboard,
  ArrowRight,
  ArrowDown,
} from 'lucide-react';

export default function PipelineAnimation({ isConnected, isDemo }) {
  const stages = [
    { id: 1, name: 'Raspberry Pi 3', desc: 'Edge Microcontroller', icon: Cpu },
    { id: 2, name: 'Camera Module', desc: 'CSI/USB Sensor', icon: Camera },
    { id: 3, name: 'Image Capture', desc: 'Raw Frame Acquisition', icon: FileImage },
    { id: 4, name: 'Python Client', desc: 'pi_client.py HTTP Post', icon: Terminal },
    { id: 5, name: 'FastAPI Backend', desc: 'REST Endpoint Router', icon: Server },
    { id: 6, name: 'AMSF-Net Model', desc: 'Deep Multi-Scale Inference', icon: Network },
    { id: 7, name: 'Prediction Result', desc: 'Softmax Classification', icon: CheckCircle2 },
    { id: 8, name: 'Web Dashboard', desc: 'Real-Time Visualization', icon: LayoutDashboard },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-100">Hardware Image Acquisition Pipeline</h4>
          <p className="text-xs text-slate-400">
            End-to-end edge inference and streaming flow from field sensor to monitoring dashboard
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Pipeline State:</span>
          <span
            className={`font-semibold font-mono px-2 py-0.5 rounded ${
              isConnected
                ? isDemo
                  ? 'bg-purple-950/80 text-purple-300 border border-purple-800/60'
                  : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                : 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
            }`}
          >
            {isConnected ? (isDemo ? 'SIMULATED ACTIVE' : 'ACTIVE PIPELINE') : 'WAITING FOR HARDWARE'}
          </span>
        </div>
      </div>

      {/* Grid of pipeline stages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isActive = isConnected;

          return (
            <div
              key={stage.id}
              className={`p-4 rounded-xl border transition-all duration-300 relative ${
                isActive
                  ? isDemo
                    ? 'bg-slate-900/80 border-purple-900/50 shadow-md shadow-purple-950/30'
                    : 'bg-slate-900/80 border-indigo-900/50 shadow-md shadow-indigo-950/30'
                  : 'bg-slate-950/60 border-slate-900 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono font-bold text-slate-400">
                  STAGE 0{stage.id}
                </span>
                <div
                  className={`w-2 h-2 rounded-full ${
                    isActive
                      ? isDemo
                        ? 'bg-purple-400 animate-ping'
                        : 'bg-emerald-400 animate-ping'
                      : 'bg-amber-500'
                  }`}
                />
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-lg border ${
                    isActive
                      ? isDemo
                        ? 'bg-purple-950/70 border-purple-800/60 text-purple-300'
                        : 'bg-indigo-950/70 border-indigo-800/60 text-indigo-300'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-100">{stage.name}</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">{stage.desc}</p>
                </div>
              </div>

              {/* Step connector note */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>{isActive ? 'Transmitting' : 'Idle'}</span>
                {idx < stages.length - 1 && (
                  <span className="text-indigo-400 flex items-center gap-0.5">
                    Next <ArrowRight className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
