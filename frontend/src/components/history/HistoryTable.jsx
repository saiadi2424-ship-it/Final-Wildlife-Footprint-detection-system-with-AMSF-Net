import React, { useState } from 'react';
import {
  Search,
  Filter,
  Trash2,
  Calendar,
  Clock,
  Cpu,
  Globe,
  ExternalLink,
  X,
  AlertTriangle,
} from 'lucide-react';
import { getImageUrl } from '../../api/client';

export default function HistoryTable({
  items,
  total,
  sourceFilter,
  setSourceFilter,
  searchTerm,
  setSearchTerm,
  onClearHistory,
  loading,
}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      const d = new Date(isoString);
      return d.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-slate-950/70 border border-indigo-950/80">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search species, source..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="all">All Sources</option>
              <option value="web">Web Client Only</option>
              <option value="raspberry_pi">Raspberry Pi Only</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setShowClearModal(true)}
            disabled={items.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="glass-panel rounded-xl overflow-hidden border border-indigo-950/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-indigo-950/80 bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Footprint Image</th>
                <th className="py-3 px-4">AMSF-Net Prediction</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-950/50 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    <div className="inline-block w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2" />
                    <p>Loading prediction history...</p>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="font-semibold text-slate-300">No Predictions Found</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Inferences performed via Web Upload or Raspberry Pi 3 will be recorded here.
                    </p>
                  </td>
                </tr>
              ) : (
                items.map((row) => {
                  const isPi = row.source.toLowerCase().includes('pi');
                  const fullImgUrl = getImageUrl(row.image_url);

                  const speciesColors = {
                    Deer: 'text-sky-300 bg-sky-950/60 border-sky-800/60',
                    Tiger: 'text-amber-300 bg-amber-950/60 border-amber-800/60',
                    Wolf: 'text-purple-300 bg-purple-950/60 border-purple-800/60',
                  };

                  return (
                    <tr key={row.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-300 whitespace-nowrap">
                        {formatDate(row.timestamp)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                            isPi
                              ? 'bg-purple-950/60 text-purple-300 border-purple-800/60'
                              : 'bg-indigo-950/60 text-indigo-300 border-indigo-800/60'
                          }`}
                        >
                          {isPi ? <Cpu className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                          <span className="capitalize">{row.source}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {fullImgUrl ? (
                          <button
                            type="button"
                            onClick={() => setSelectedImage(fullImgUrl)}
                            className="relative group w-12 h-12 rounded-lg overflow-hidden border border-indigo-900/50 bg-slate-900 block"
                          >
                            <img
                              src={fullImgUrl}
                              alt={row.prediction}
                              className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <ExternalLink className="w-3.5 h-3.5 text-white" />
                            </div>
                          </button>
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px]">N/A</span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${
                            speciesColors[row.prediction] || 'text-slate-300 bg-slate-900'
                          }`}
                        >
                          {row.prediction.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                        {row.confidence.toFixed(2)}%
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300 whitespace-nowrap">
                        {row.inference_time_ms} ms
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-xl w-full bg-slate-900 border border-indigo-800/80 rounded-2xl p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white">Footprint Image Preview</h4>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[450px] overflow-hidden rounded-xl bg-black flex items-center justify-center">
              <img src={selectedImage} alt="Footprint preview" className="max-h-[450px] w-auto object-contain" />
            </div>
          </div>
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-rose-800/80 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h4 className="text-base font-bold text-white">Clear Prediction History?</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This action will permanently delete all {total} recorded wildlife footprint predictions from the SQLite database.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearHistory();
                  setShowClearModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white shadow-md shadow-rose-600/30"
              >
                Confirm Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
