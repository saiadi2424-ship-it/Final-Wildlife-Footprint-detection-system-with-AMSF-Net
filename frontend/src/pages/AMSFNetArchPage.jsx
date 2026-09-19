import React from 'react';
import { Network, Sparkles, Layers, Cpu, ShieldCheck } from 'lucide-react';
import AMSFNetPipeline from '../components/architecture/AMSFNetPipeline';
import GlassCard from '../components/common/GlassCard';

export default function AMSFNetArchPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-950 to-purple-950/60 border border-indigo-900/40">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-xs font-semibold text-indigo-300 mb-3">
          <Network className="w-3.5 h-3.5 text-indigo-400" />
          <span>NEURAL ARCHITECTURE</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          AMSF-Net Architecture
        </h1>
        <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
          Detailed technical breakdown of the Adaptive Multi-Scale Feature Fusion Network,
          designed specifically for wildlife footprint classification in edge and field settings.
        </p>
      </div>

      {/* 10-Stage Pipeline Visualizer */}
      <AMSFNetPipeline />

      {/* Theoretical Foundation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard
          title="Multi-Scale Feature Learning"
          subtitle="Capturing diverse footprint features"
          icon={Layers}
        >
          <p className="text-xs text-slate-300 leading-relaxed">
            Animal footprints exhibit multi-granular visual features: fine claw impressions require small receptive fields (3×3),
            while overall pad contour and inter-digital spacing require wide receptive fields (5×5 or dilated convolutions).
            AMSF-Net processes both scales simultaneously in parallel branches.
          </p>
        </GlassCard>

        <GlassCard
          title="Channel Attention Refinement"
          subtitle="Adaptive feature recalibration"
          icon={Sparkles}
        >
          <p className="text-xs text-slate-300 leading-relaxed">
            Footprints in natural terrain often suffer from noisy substrates (mud, sand, wet leaves).
            The Squeeze-and-Excitation channel attention mechanism suppresses background substrate noise
            and amplifies biologically salient ridge and pad features.
          </p>
        </GlassCard>

        <GlassCard
          title="Lightweight Edge Efficiency"
          subtitle="155,173 trainable parameters"
          icon={Cpu}
        >
          <p className="text-xs text-slate-300 leading-relaxed">
            By employing Global Average Pooling (GAP) and bottleneck 1×1 convolutions, AMSF-Net avoids the parameter bloat
            of legacy networks (e.g. VGG's 138M or ResNet's 25M). With only 155K parameters, it achieves rapid inference
            while maintaining an 84.13% validation accuracy.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
