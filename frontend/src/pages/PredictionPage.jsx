import React, { useState } from 'react';
import {
  PawPrint,
  Upload,
  Eye,
  Zap,
  Server,
  Network,
  CheckCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useSystem } from '../context/SystemContext';
import { predictFootprint } from '../api/client';
import GlassCard from '../components/common/GlassCard';
import ImageDropzone from '../components/prediction/ImageDropzone';
import PredictionResult from '../components/prediction/PredictionResult';
import ProbabilityChart from '../components/prediction/ProbabilityChart';

export default function PredictionPage() {
  const { showToast } = useSystem();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const workflowSteps = [
    { label: 'UPLOAD', icon: Upload, active: !selectedFile },
    { label: 'IMAGE PREVIEW', icon: Eye, active: !!selectedFile && !prediction },
    { label: 'ANALYZE', icon: Zap, active: loading },
    { label: 'FASTAPI', icon: Server, active: loading },
    { label: 'AMSF-NET', icon: Network, active: loading },
    { label: 'RESULT', icon: CheckCircle, active: !!prediction },
  ];

  const handleFileSelected = (file) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPrediction(null);
  };

  const handleReset = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPrediction(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setLoading(true);
    try {
      const res = await predictFootprint(selectedFile, 'web');
      setPrediction(res);
      showToast(`AMSF-Net classified footprint as ${res.prediction} (${res.confidence}%)`, 'success');
    } catch (err) {
      showToast(err.message || 'Analysis failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Workflow Stepper */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-indigo-950/80">
        <div className="flex items-center justify-between overflow-x-auto gap-2 py-1">
          {workflowSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="flex items-center gap-2 shrink-0">
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                    step.active
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{step.label}</span>
                </div>
                {idx < workflowSteps.length - 1 && (
                  <span className="text-slate-600 text-xs">→</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Acquisition & Controls */}
        <div className="lg:col-span-6 space-y-6">
          <GlassCard
            title="Footprint Acquisition Workspace"
            subtitle="Upload animal track photography for multi-scale feature analysis"
            icon={PawPrint}
          >
            <div className="space-y-4">
              <ImageDropzone
                selectedFile={selectedFile}
                previewUrl={previewUrl}
                onFileSelected={handleFileSelected}
                onReset={handleReset}
              />

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={!selectedFile || loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs transition-all duration-150 shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap className="w-4 h-4" />
                  <span>{loading ? 'Analyzing with AMSF-Net...' : 'Analyze Image'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  disabled={!selectedFile && !prediction}
                  className="flex items-center gap-1.5 py-3 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Prediction Details & Probability Chart */}
        <div className="lg:col-span-6 space-y-6">
          <GlassCard
            title="Classification Decision"
            subtitle="Verified inference result computed by AMSF-Net"
            icon={CheckCircle}
          >
            <PredictionResult result={prediction} loading={loading} />
          </GlassCard>

          <GlassCard
            title="Softmax Probability Distribution"
            subtitle="Actual class probabilities produced by AMSF-Net classifier head"
            icon={Sparkles}
          >
            <ProbabilityChart probabilities={prediction?.probabilities} />
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
