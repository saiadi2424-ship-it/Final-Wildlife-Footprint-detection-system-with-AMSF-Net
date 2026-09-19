import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Maximize2,
  Combine,
  Sliders,
  Compass,
  Cpu,
  Binary,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

export default function AMSFNetPipeline() {
  const [selectedStage, setSelectedStage] = useState(1);

  const stages = [
    {
      id: 1,
      title: 'Input Image',
      spec: '224 × 224 × 3 RGB',
      desc: 'Raw wildlife footprint image captured from the field camera or uploaded via web interface.',
      details: 'Accepts standardized 224×224 3-channel RGB image tensor representing terrestrial animal track imprint.',
      icon: Maximize2,
    },
    {
      id: 2,
      title: 'Preprocessing & Normalization',
      spec: 'Mean=[0.485, 0.456, 0.406]',
      desc: 'Resizing, tensor scaling to [0, 1], and channel-wise ImageNet standard normalization.',
      details: 'Ensures numerical stability during multi-scale convolutions and minimizes lighting variance.',
      icon: Sliders,
    },
    {
      id: 3,
      title: 'Feature Extraction',
      spec: 'Conv2d Stem (32 & 64 filters)',
      desc: 'Initial convolution stem capturing low-level edges, footprint claw impressions, and contour ridges.',
      details: 'Two sequential 3x3 convolutions with stride 2 downsampling spatial resolution from 224×224 to 56×56.',
      icon: Layers,
    },
    {
      id: 4,
      title: 'Multi-Scale Feature Learning',
      spec: 'Parallel Branches (1×1, 3×3, 5×5)',
      desc: 'Extracts spatial features simultaneously across multiple receptive field scales.',
      details: 'Captures both fine claw marks (small receptive field) and overall pad geometry (large receptive field).',
      icon: Sparkles,
    },
    {
      id: 5,
      title: 'Feature Fusion',
      spec: 'Adaptive Channel Concat',
      desc: 'Integrates multi-receptive field feature maps into a unified composite representation.',
      details: 'Merges multi-scale branch outputs with 1×1 bottleneck convolution for high representational density.',
      icon: Combine,
    },
    {
      id: 6,
      title: 'Attention / Feature Refinement',
      spec: 'Channel Attention (SE Block)',
      desc: 'Dynamically reweights channel importance to emphasize discriminatory footprint characteristics.',
      details: 'Applies Squeeze-and-Excitation global average pooling with two FC layers and Sigmoid activation.',
      icon: Compass,
    },
    {
      id: 7,
      title: 'Global Representation',
      spec: 'Global Average Pooling (GAP)',
      desc: 'Reduces spatial dimensions (14×14×128) to a compact 1D vector representation.',
      details: 'Replaces bulky fully connected layers to drastically minimize parameter count to 155K.',
      icon: Cpu,
    },
    {
      id: 8,
      title: 'Classifier Head',
      spec: 'Dense 128 -> 64 -> 3',
      desc: 'Linear projection layer with 30% dropout for regularization.',
      details: 'Computes unnormalized class logits for the 3 supported target wildlife species.',
      icon: Binary,
    },
    {
      id: 9,
      title: 'Softmax Layer',
      spec: 'Normalized Probabilities',
      desc: 'Transforms raw network logits into well-calibrated class probability percentages.',
      details: 'Ensures sum of class probabilities equals 1.0 (100%) for transparent confidence estimation.',
      icon: Sparkles,
    },
    {
      id: 10,
      title: 'Target Species Output',
      spec: 'Deer / Tiger / Wolf',
      desc: 'Final classification decision with verified confidence score.',
      details: 'Outputs highest confidence species label along with complete probability distribution.',
      icon: CheckCircle2,
    },
  ];

  const activeStage = stages.find((s) => s.id === selectedStage) || stages[0];
  const ActiveIcon = activeStage.icon;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-950/60 border border-indigo-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Adaptive Multi-Scale Feature Fusion Network (AMSF-Net)
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              A specialized lightweight deep learning architecture designed for wildlife footprint classification,
              combining parallel multi-scale convolutions with channel attention calibration.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="text-[11px] text-slate-400 font-medium">Trainable Parameters</div>
              <div className="text-lg font-bold font-mono text-indigo-300">155,173</div>
            </div>
            <div className="h-8 w-px bg-indigo-800/60" />
            <div className="text-right">
              <div className="text-[11px] text-slate-400 font-medium">Validation Accuracy</div>
              <div className="text-lg font-bold font-mono text-emerald-400">84.13%</div>
            </div>
          </div>
        </div>
      </div>

      {/* 10-Stage Interactive Visual Pipeline */}
      <div>
        <div className="flex items-center justify-between mb-3 text-xs text-slate-400 font-medium">
          <span>Click any stage below to inspect internal mechanics</span>
          <span>10 Architectural Stages</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
          {stages.map((stage) => {
            const isCurrent = stage.id === selectedStage;
            const Icon = stage.icon;
            return (
              <button
                key={stage.id}
                onClick={() => setSelectedStage(stage.id)}
                className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between min-h-[110px] ${
                  isCurrent
                    ? 'bg-gradient-to-b from-indigo-600/90 to-purple-700/90 border-indigo-400 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-950/70 border-indigo-950/70 text-slate-300 hover:border-indigo-800 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[10px] font-mono font-bold ${isCurrent ? 'text-indigo-200' : 'text-slate-400'}`}>
                    0{stage.id}
                  </span>
                  <Icon className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-indigo-400'}`} />
                </div>
                <div>
                  <h5 className="text-xs font-bold leading-tight line-clamp-2 mt-2">{stage.title}</h5>
                  <p className={`text-[10px] font-mono mt-1 truncate ${isCurrent ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {stage.spec}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Stage Detail Panel */}
      <div className="glass-panel rounded-xl p-6 border border-indigo-900/50">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-xl bg-indigo-950/70 border border-indigo-800/60 text-indigo-300">
            <ActiveIcon className="w-7 h-7" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                Stage {activeStage.id} of 10
              </span>
              <span className="px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
                Specification: {activeStage.spec}
              </span>
            </div>
            <h4 className="text-lg font-bold text-white">{activeStage.title}</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{activeStage.desc}</p>
            <div className="mt-3 p-3.5 rounded-lg bg-slate-950/80 border border-indigo-950/80 text-xs text-slate-400 leading-normal">
              <strong className="text-indigo-300 font-medium">Internal Processing: </strong>
              {activeStage.details}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
