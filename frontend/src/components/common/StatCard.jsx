import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = 'indigo', // 'indigo' | 'purple' | 'blue' | 'emerald'
}) {
  const accentColors = {
    indigo: {
      bg: 'bg-indigo-950/40 border-indigo-800/40 text-indigo-400',
      glow: 'group-hover:border-indigo-500/50',
    },
    purple: {
      bg: 'bg-purple-950/40 border-purple-800/40 text-purple-400',
      glow: 'group-hover:border-purple-500/50',
    },
    blue: {
      bg: 'bg-blue-950/40 border-blue-800/40 text-blue-400',
      glow: 'group-hover:border-blue-500/50',
    },
    emerald: {
      bg: 'bg-emerald-950/40 border-emerald-800/40 text-emerald-400',
      glow: 'group-hover:border-emerald-500/50',
    },
  };

  const currentAccent = accentColors[accent] || accentColors.indigo;

  return (
    <div className={`group glass-panel rounded-xl p-5 border transition-all duration-200 hover:-translate-y-1 ${currentAccent.glow}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 tracking-wider uppercase">{title}</p>
          <h4 className="text-2xl font-bold text-slate-100 mt-2 tracking-tight">{value}</h4>
          {subtitle && <p className="text-xs text-slate-400 mt-1 font-medium">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg border ${currentAccent.bg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
