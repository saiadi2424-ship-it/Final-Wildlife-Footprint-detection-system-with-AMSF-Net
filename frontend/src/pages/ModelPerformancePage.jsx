import React from 'react';
import {
  BarChart3,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  Cpu,
  Clock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import StatCard from '../components/common/StatCard';

export default function ModelPerformancePage() {
  const verifiedMetrics = [
    {
      title: 'Validation Accuracy',
      value: '84.13%',
      subtitle: 'Verified on AMSF-Net Validation Set',
      status: 'VERIFIED',
      accent: 'emerald',
      icon: CheckCircle2,
    },
    {
      title: 'Trainable Parameters',
      value: '155,173',
      subtitle: 'Lightweight Deep Architecture',
      status: 'VERIFIED',
      accent: 'indigo',
      icon: Cpu,
    },
    {
      title: 'Input Resolution',
      value: '224 × 224',
      subtitle: '3-Channel RGB Tensor',
      status: 'VERIFIED',
      accent: 'purple',
      icon: Layers,
    },
    {
      title: 'Class Cardinality',
      value: '3 Species',
      subtitle: 'Deer • Tiger • Wolf',
      status: 'VERIFIED',
      accent: 'blue',
      icon: ShieldCheck,
    },
  ];

  const pendingMetrics = [
    {
      name: 'Training Accuracy',
      category: 'Epoch Performance',
      description: 'Training curve accuracy across completed epochs.',
    },
    {
      name: 'Test Set Accuracy',
      category: 'Generalization',
      description: 'Independent evaluation on unseen test partition.',
    },
    {
      name: 'Macro Precision',
      category: 'Evaluation Metric',
      description: 'Precision averaged across Deer, Tiger, and Wolf classes.',
    },
    {
      name: 'Macro Recall',
      category: 'Evaluation Metric',
      description: 'True positive rate across all species footprint types.',
    },
    {
      name: 'Macro F1-Score',
      category: 'Harmonic Mean',
      description: 'Harmonic mean of precision and recall for multi-class footprint balance.',
    },
    {
      name: 'Confusion Matrix',
      category: 'Class Disambiguation',
      description: 'Cross-tabulation of true vs predicted footprint class distribution.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-950 to-purple-950/60 border border-indigo-900/40">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-xs font-semibold text-indigo-300 mb-3">
          <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
          <span>RESEARCH BENCHMARKS</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          AMSF-Net Model Performance
        </h1>
        <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
          Empirical validation metrics for the Adaptive Multi-Scale Feature Fusion Network.
          In accordance with strict academic integrity, only verified metrics are displayed; unconfigured metrics are clearly marked.
        </p>
      </div>

      {/* Verified Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {verifiedMetrics.map((m) => (
          <StatCard
            key={m.title}
            title={m.title}
            value={m.value}
            subtitle={m.subtitle}
            icon={m.icon}
            accent={m.accent}
          />
        ))}
      </div>

      {/* Research Integrity Notice */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-900/40 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <span className="font-semibold text-white">Academic Metric Integrity Standard: </span>
          <span className="text-slate-300">
            This platform strictly prohibits the generation of synthetic, fabricated, or simulated precision, recall, F1,
            or confusion matrix values. Unconfigured metrics will remain in the unconfigured state until actual validation outputs
            are integrated.
          </span>
        </div>
      </div>

      {/* Pending / Unconfigured Metrics Grid */}
      <GlassCard
        title="Extended Evaluation Metrics"
        subtitle="Current configuration status for secondary research metrics"
        icon={BarChart3}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingMetrics.map((metric) => (
            <div
              key={metric.name}
              className="p-5 rounded-xl bg-slate-950/60 border border-indigo-950/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-slate-400 text-[11px] uppercase tracking-wider">
                    {metric.category}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-950/40 border border-amber-800/40 text-[10px] font-semibold text-amber-300">
                    <AlertCircle className="w-3 h-3" />
                    Metric not currently configured
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-200">{metric.name}</h4>
                <p className="text-xs text-slate-400 mt-1">{metric.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-xs">
                <span className="text-slate-400">Value:</span>
                <span className="font-mono text-slate-400 italic">Data not available</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Confusion Matrix Section (Proper Data Not Available State) */}
      <GlassCard
        title="Confusion Matrix Visualization"
        subtitle="3x3 species contingency matrix for Deer, Tiger, and Wolf"
        icon={Layers}
      >
        <div className="p-8 rounded-xl bg-slate-950/60 border border-indigo-950/70 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mb-3">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-semibold text-slate-200">Confusion Matrix Not Currently Configured</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-md">
            The full test confusion matrix will be rendered when test-set ground truth logs are supplied to the backend.
            No placeholder confusion values are fabricated.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
