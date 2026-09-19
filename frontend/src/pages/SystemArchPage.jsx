import React from 'react';
import { GitFork, Server, Globe, Cpu, Database } from 'lucide-react';
import SystemDualPipeline from '../components/architecture/SystemDualPipeline';
import GlassCard from '../components/common/GlassCard';

export default function SystemArchPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-950 to-purple-950/60 border border-indigo-900/40">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-xs font-semibold text-indigo-300 mb-3">
          <GitFork className="w-3.5 h-3.5 text-indigo-400" />
          <span>SYSTEM ARCHITECTURE</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          System & Hardware Architecture
        </h1>
        <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
          Complete end-to-end integration diagram illustrating software and hardware pipelines,
          from Raspberry Pi 3 edge acquisition to FastAPI AMSF-Net inference.
        </p>
      </div>

      {/* Dual Pathway Visualizer */}
      <SystemDualPipeline />

      {/* Architectural Component Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard
          title="Edge Hardware Node"
          subtitle="Raspberry Pi 3 Model B"
          icon={Cpu}
        >
          <div className="space-y-2 text-xs text-slate-300">
            <p><strong>Role:</strong> Autonomous field camera station.</p>
            <p><strong>Storage:</strong> 32 GB Class-10 Micro-SD card with lightweight OS.</p>
            <p><strong>Client:</strong> Python 3 script capturing frames and dispatching HTTP multipart requests to the central server.</p>
          </div>
        </GlassCard>

        <GlassCard
          title="Inference & API Backend"
          subtitle="FastAPI + PyTorch Runtime"
          icon={Server}
        >
          <div className="space-y-2 text-xs text-slate-300">
            <p><strong>Role:</strong> Centralized AI classification engine.</p>
            <p><strong>Model:</strong> AMSF-Net loaded in PyTorch runtime with CUDA/CPU automatic device dispatch.</p>
            <p><strong>Endpoints:</strong> Asynchronous REST endpoints for prediction, telemetry, and health monitoring.</p>
          </div>
        </GlassCard>

        <GlassCard
          title="Database & State"
          subtitle="SQLite WAL Mode"
          icon={Database}
        >
          <div className="space-y-2 text-xs text-slate-300">
            <p><strong>Role:</strong> High-throughput persistence for inferences and hardware logs.</p>
            <p><strong>Mode:</strong> Write-Ahead Logging (WAL) for concurrent reads/writes without lock contention.</p>
            <p><strong>Storage:</strong> Stores timestamps, confidence metrics, and image previews.</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
