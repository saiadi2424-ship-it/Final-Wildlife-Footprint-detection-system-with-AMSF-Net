import React, { useState, useEffect, useCallback } from 'react';
import { Clock, RefreshCw } from 'lucide-react';
import { useSystem } from '../context/SystemContext';
import { getPredictionHistory, clearPredictionHistory } from '../api/client';
import HistoryTable from '../components/history/HistoryTable';
import GlassCard from '../components/common/GlassCard';

export default function HistoryPage() {
  const { showToast } = useSystem();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [sourceFilter, setSourceFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPredictionHistory({
        source: sourceFilter,
        search: searchTerm,
        limit: 100,
        offset: 0,
      });
      setItems(res.items || []);
      setTotal(res.total || 0);
    } catch (err) {
      showToast('Failed to fetch prediction history', 'error');
    } finally {
      setLoading(false);
    }
  }, [sourceFilter, searchTerm, showToast]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleClearHistory = async () => {
    try {
      const res = await clearPredictionHistory();
      setItems([]);
      setTotal(0);
      showToast(`Cleared ${res.count} prediction records`, 'info');
    } catch (err) {
      showToast('Failed to clear prediction history', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-950 to-purple-950/60 border border-indigo-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-xs font-semibold text-indigo-300 mb-3">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>PREDICTION AUDIT LOG</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Prediction History
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
            Chronological audit log of all wildlife footprint inferences from both Web Uploads and Raspberry Pi 3 edge captures.
          </p>
        </div>

        <button
          onClick={fetchHistory}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-indigo-900/50 text-slate-200 hover:text-white text-xs font-semibold self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Log</span>
        </button>
      </div>

      {/* History Table */}
      <HistoryTable
        items={items}
        total={total}
        sourceFilter={sourceFilter}
        setSourceFilter={setSourceFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onClearHistory={handleClearHistory}
        loading={loading}
      />
    </div>
  );
}
