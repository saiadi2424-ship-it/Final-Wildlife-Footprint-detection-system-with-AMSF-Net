import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

export default function ProbabilityChart({ probabilities }) {
  if (!probabilities) {
    return (
      <div className="h-48 flex items-center justify-center text-xs text-slate-400 border border-indigo-950/60 rounded-xl bg-slate-950/40">
        Run footprint inference to visualize softmax probability distribution
      </div>
    );
  }

  // Format data for Recharts
  const data = [
    { species: 'Deer', probability: probabilities.Deer || 0, color: '#38bdf8' },
    { species: 'Tiger', probability: probabilities.Tiger || 0, color: '#f59e0b' },
    { species: 'Wolf', probability: probabilities.Wolf || 0, color: '#a855f7' },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="p-2.5 rounded-lg bg-slate-900/95 border border-indigo-800/80 shadow-xl text-xs">
          <p className="font-semibold text-white">{item.species}</p>
          <p className="text-indigo-300 font-mono mt-0.5">
            Probability: <span className="font-bold text-white">{item.probability.toFixed(2)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
        <span className="font-semibold text-slate-200">Softmax Class Distribution</span>
        <span className="font-mono text-indigo-400">AMSF-Net Head</span>
      </div>

      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={(val) => `${val}%`}
              stroke="#1e293b"
            />
            <YAxis
              type="category"
              dataKey="species"
              tick={{ fill: '#f8fafc', fontSize: 12, fontWeight: 600 }}
              stroke="#1e293b"
              width={50}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }} />
            <Bar
              dataKey="probability"
              radius={[0, 6, 6, 0]}
              barSize={20}
              isAnimationActive={true}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Numerical Indicators */}
      <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-indigo-950/60 text-center">
        {data.map((item) => (
          <div key={item.species} className="p-2 rounded-lg bg-slate-950/60 border border-slate-900">
            <div className="text-[11px] font-medium text-slate-400">{item.species}</div>
            <div className="text-sm font-bold font-mono mt-0.5" style={{ color: item.color }}>
              {item.probability.toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
