import React from 'react';
import {
  Globe,
  Layout,
  Server,
  Network,
  CheckCircle2,
  Camera,
  Cpu,
  Terminal,
  Database,
  ArrowRight,
  ArrowDown,
} from 'lucide-react';

export default function SystemDualPipeline() {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl bg-slate-950/70 border border-indigo-950/80">
        <h3 className="text-base font-bold text-white tracking-tight">
          Unified Edge & Web System Architecture
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          The platform bridges field hardware (Raspberry Pi 3 + Camera) with a central FastAPI inference server
          and a responsive React research dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pathway A: Web Workflow */}
        <div className="glass-panel rounded-xl p-6 border border-indigo-900/40 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-indigo-950/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-950/80 text-indigo-400 border border-indigo-800/40">
                <Globe className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">Pathway A: Web Client Flow</h4>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/50">
              Interactive User Analysis
            </span>
          </div>

          <div className="space-y-3 relative">
            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-900 flex items-center gap-3">
              <Globe className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <h5 className="text-xs font-semibold text-white">1. Web Browser Client</h5>
                <p className="text-[11px] text-slate-400">Researcher uploads footprint image (JPEG/PNG)</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-900 flex items-center gap-3">
              <Layout className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <h5 className="text-xs font-semibold text-white">2. React + Vite Frontend</h5>
                <p className="text-[11px] text-slate-400">Previews image, wraps into multipart form-data</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-900 flex items-center gap-3">
              <Server className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <h5 className="text-xs font-semibold text-white">3. FastAPI REST Endpoint</h5>
                <p className="text-[11px] text-slate-400">Validates image, prepares 224×224 tensor</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-800/50 flex items-center gap-3">
              <Network className="w-5 h-5 text-indigo-300 shrink-0" />
              <div>
                <h5 className="text-xs font-semibold text-indigo-200">4. AMSF-Net PyTorch Engine</h5>
                <p className="text-[11px] text-indigo-300">Executes forward pass & softmax probabilities</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/50 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <h5 className="text-xs font-semibold text-emerald-200">5. Prediction & Persistence</h5>
                <p className="text-[11px] text-emerald-300">Results saved to SQLite & visualized on dashboard</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pathway B: Hardware Workflow */}
        <div className="glass-panel rounded-xl p-6 border border-purple-900/40 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-indigo-950/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-purple-950/80 text-purple-400 border border-purple-800/40">
                <Cpu className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white">Pathway B: Hardware Edge Flow</h4>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/50">
              Autonomous Field Capture
            </span>
          </div>

          <div className="space-y-3 relative">
            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-900 flex items-center gap-3">
              <Camera className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <h5 className="text-xs font-semibold text-white">1. Field Camera Sensor</h5>
                <p className="text-[11px] text-slate-400">Captures ground track via CSI camera / webcam</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-900 flex items-center gap-3">
              <Cpu className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <h5 className="text-xs font-semibold text-white">2. Raspberry Pi 3 Model B</h5>
                <p className="text-[11px] text-slate-400">Edge controller running Linux & 32GB Micro-SD</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-900 flex items-center gap-3">
              <Terminal className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <h5 className="text-xs font-semibold text-white">3. Python Client (pi_client.py)</h5>
                <p className="text-[11px] text-slate-400">Dispatches POST request with source="raspberry_pi"</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-800/50 flex items-center gap-3">
              <Network className="w-5 h-5 text-indigo-300 shrink-0" />
              <div>
                <h5 className="text-xs font-semibold text-indigo-200">4. FastAPI & AMSF-Net Model</h5>
                <p className="text-[11px] text-indigo-300">Central server evaluates multi-scale footprint features</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/50 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <h5 className="text-xs font-semibold text-emerald-200">5. Edge Return & Real-Time Monitor</h5>
                <p className="text-[11px] text-emerald-300">Pi receives response; dashboard polls & displays result</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
