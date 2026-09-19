import React from 'react';

export default function StatusBadge({ status, label, pulse = false }) {
  const normStatus = (status || '').toUpperCase();
  
  let bgClass = 'bg-slate-800/80 text-slate-300 border-slate-700';
  let dotClass = 'bg-slate-400';

  if (normStatus.includes('ONLINE') || normStatus.includes('ACTIVE') || normStatus === 'CONNECTED') {
    bgClass = 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60';
    dotClass = 'bg-emerald-400';
  } else if (normStatus.includes('WAITING')) {
    bgClass = 'bg-amber-950/60 text-amber-300 border-amber-800/60';
    dotClass = 'bg-amber-400';
  } else if (normStatus.includes('SIMULAT') || normStatus.includes('DEMO')) {
    bgClass = 'bg-purple-950/60 text-purple-300 border-purple-800/60';
    dotClass = 'bg-purple-400';
  } else if (normStatus.includes('OFFLINE') || normStatus.includes('ERROR')) {
    bgClass = 'bg-rose-950/60 text-rose-300 border-rose-800/60';
    dotClass = 'bg-rose-400';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide border shadow-sm ${bgClass}`}>
      <span className={`w-2 h-2 rounded-full ${dotClass} ${pulse ? 'animate-ping' : ''}`} />
      <span>{label || status}</span>
    </span>
  );
}
