import React, { useState } from 'react';
import {
  PawPrint,
  Layers,
  Cpu,
  Target,
  CheckCircle2,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { useSystem } from '../context/SystemContext';
import { predictFootprint } from '../api/client';
import StatCard from '../components/common/StatCard';
import GlassCard from '../components/common/GlassCard';
import ImageDropzone from '../components/prediction/ImageDropzone';
import PredictionResult from '../components/prediction/PredictionResult';

export default function DashboardPage() {
  const { apiHealth, hardwareTelemetry, hardwareMode, showToast } = useSystem();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

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
      showToast(`Predicted: ${res.prediction} (${res.confidence}%)`, 'success');
    } catch (err) {
      showToast(err.message || 'Inference failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-slate-950 to-purple-950/60 border border-indigo-900/40 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-xs font-semibold text-indigo-300 mb-3">
            <PawPrint className="w-3.5 h-3.5 text-indigo-400" />
            <span>WILDLIFE FOOTPRINT AI</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
            AI-Based Wildlife Footprint Recognition using AMSF-Net
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-2 leading-relaxed">
            Automated track identification platform for wildlife monitoring and conservation.
            Powered by the custom <strong>Adaptive Multi-Scale Feature Fusion Network (AMSF-Net)</strong>,
            integrated with Raspberry Pi 3 edge cameras and real-time telemetry.
          </p>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Deep Learning Model"
          value="AMSF-Net"
          subtitle="Adaptive Multi-Scale Fusion"
          icon={Layers}
          accent="indigo"
        />
        <StatCard
          title="Supported Species"
          value="3 Classes"
          subtitle="Deer • Tiger • Wolf"
          icon={Target}
          accent="purple"
        />
        <StatCard
          title="Trainable Parameters"
          value="155,173"
          subtitle="Lightweight Edge AI"
          icon={Cpu}
          accent="blue"
        />
        <StatCard
          title="Validation Accuracy"
          value="84.13%"
          subtitle="Verified Benchmark"
          icon={CheckCircle2}
          accent="emerald"
        />
      </div>

      {/* Live Prediction Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Upload Wildlife Footprint */}
        <div className="lg:col-span-6">
          <GlassCard
            title="Upload Wildlife Footprint"
            subtitle="Drag-and-drop or select an animal track image for real-time inference"
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
                  <span>{loading ? 'Analyzing with AMSF-Net...' : 'Analyze Footprint'}</span>
                </button>
                {selectedFile && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="py-3 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Side: Prediction Result */}
        <div className="lg:col-span-6">
          <GlassCard
            title="Prediction Result"
            subtitle="Real-time classification, confidence score, and inference latency"
            icon={Zap}
          >
            <PredictionResult result={prediction} loading={loading} />
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
