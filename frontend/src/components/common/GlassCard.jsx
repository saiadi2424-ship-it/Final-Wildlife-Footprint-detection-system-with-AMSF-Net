import React from 'react';

export default function GlassCard({
  title,
  subtitle,
  icon: Icon,
  badge,
  children,
  className = '',
  action,
}) {
  return (
    <div className={`glass-panel rounded-xl p-5 md:p-6 transition-all duration-200 ${className}`}>
      {(title || Icon || badge || action) && (
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-indigo-950/80">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2.5 rounded-lg bg-indigo-950/60 border border-indigo-800/40 text-indigo-400">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <div>
              {title && <h3 className="text-base font-semibold text-slate-100 tracking-tight">{title}</h3>}
              {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {badge}
            {action}
          </div>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
