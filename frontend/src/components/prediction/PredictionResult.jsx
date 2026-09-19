import React from 'react';
import { CheckCircle2, Clock, Cpu, ShieldCheck, HelpCircle } from 'lucide-react';

export default function PredictionResult({ result, loading }) {
  if (loading) {
    return (
      <div className="h-full min-h-[280px] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-4"></div>
        <h4 className="text-sm font-semibold text-slate-200">Analyzing Wildlife Footprint...</h4>
        <p className="text-xs text-slate-400 mt-1">Executing AMSF-Net multi-scale feature extraction & classification</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="h-full min-h-[280px] flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-indigo-950/60 rounded-xl bg-slate-950/30">
        <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mb-3">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-slate-200">No Prediction Yet</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          Upload a footprint image and click "Analyze Footprint" to view AMSF-Net classification results.
        </p>
      </div>
    );
  }

  const speciesBadges = {
    Deer: {
      color: 'from-sky-500 to-blue-600',
      text: 'text-sky-300',
      bg: 'bg-sky-950/40 border-sky-800/50',
      latin: 'Artiodactyla / Cervidae',
    },
    Tiger: {
      color: 'from-amber-500 to-orange-600',
      text: 'text-amber-300',
      bg: 'bg-amber-950/40 border-amber-800/50',
      latin: 'Panthera tigris',
    },
    Wolf: {
      color: 'from-purple-500 to-indigo-600',
      text: 'text-purple-300',
      bg: 'bg-purple-950/40 border-purple-800/50',
      latin: 'Canis lupus',
    },
  };

  const currentSpecies = speciesBadges[result.prediction] || speciesBadges.Deer;

  return (
    <div className="space-y-4">
      {/* Main Species Badge Card */}
      <div className={`p-5 rounded-xl border ${currentSpecies.bg} relative overflow-hidden`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-300">
            Identified Wildlife Species
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700 text-slate-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Verified Inference
          </span>
        </div>

        <div className="mt-3 flex items-baseline gap-3">
          <h2 className="text-3xl font-extrabold text-white tracking-tight uppercase">
            {result.prediction}
          </h2>
          <span className="text-xs text-slate-400 italic">
            ({currentSpecies.latin})
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Confidence Score</div>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
              {result.confidence.toFixed(2)}%
            </div>
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Inference Latency</div>
            <div className="text-xl font-bold font-mono text-indigo-300 mt-0.5">
              {result.inference_time_ms} ms
            </div>
          </div>
        </div>
      </div>

      {/* Telemetry & Metadata Row */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-slate-950/70 border border-indigo-950/60 flex items-center gap-2.5">
          <Cpu className="w-4 h-4 text-indigo-400 shrink-0" />
          <div>
            <div className="text-slate-400 text-[11px]">Model Architecture</div>
            <div className="font-semibold text-slate-200">AMSF-Net (155K params)</div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-950/70 border border-indigo-950/60 flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-purple-400 shrink-0" />
          <div>
            <div className="text-slate-400 text-[11px]">Acquisition Source</div>
            <div className="font-semibold text-slate-200 capitalize">
              {result.source || 'Web Client'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
