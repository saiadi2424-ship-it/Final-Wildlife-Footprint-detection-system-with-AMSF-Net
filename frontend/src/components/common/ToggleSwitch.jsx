import React from 'react';
import { Radio, Sparkles } from 'lucide-react';

export default function ToggleSwitch({ mode, onChange }) {
  const isLive = mode === 'live';

  return (
    <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-indigo-900/40 rounded-xl">
      <button
        type="button"
        onClick={() => onChange('live')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
          isLive
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Radio className="w-3.5 h-3.5" />
        <span>LIVE HARDWARE</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('demo')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
          !isLive
            ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>DEMO MODE</span>
      </button>
    </div>
  );
}
