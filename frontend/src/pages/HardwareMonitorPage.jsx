import React from 'react';
import {
  Cpu,
  RefreshCw,
  Clock,
  ShieldAlert,
  HelpCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useSystem } from '../context/SystemContext';
import DeviceStatusCards from '../components/hardware/DeviceStatusCards';
import PipelineAnimation from '../components/hardware/PipelineAnimation';
import GlassCard from '../components/common/GlassCard';
import ToggleSwitch from '../components/common/ToggleSwitch';
import { getImageUrl } from '../api/client';

export default function HardwareMonitorPage() {
  const { hardwareTelemetry, hardwareMode, setHardwareMode, pollHardware } = useSystem();

  const isDemo = hardwareMode === 'demo';
  const isConnected = isDemo || hardwareTelemetry.device_status === 'CONNECTED';
  const latestPred = hardwareTelemetry.latest_prediction;

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-purple-950/50 via-slate-950 to-indigo-950/60 border border-indigo-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-xs font-semibold text-indigo-300 mb-3">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>EDGE DEPLOYMENT</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            RASPBERRY PI 3 MONITOR
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
            Real-time telemetry and edge inference status for the field-deployed Raspberry Pi 3 Model B camera station.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <ToggleSwitch mode={hardwareMode} onChange={setHardwareMode} />
          <button
            onClick={pollHardware}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-indigo-900/50 text-slate-200 hover:text-white text-xs font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Poll Device</span>
          </button>
        </div>
      </div>

      {/* Hardware Status Cards */}
      <DeviceStatusCards telemetry={hardwareTelemetry} isDemo={isDemo} />

      {/* Hardware Data Flow Pipeline */}
      <GlassCard
        title="Hardware Data Acquisition Pipeline"
        subtitle="End-to-end edge inference transmission pipeline from physical sensor to cloud dashboard"
        icon={Cpu}
      >
        <PipelineAnimation isConnected={isConnected} isDemo={isDemo} />
      </GlassCard>

      {/* Latest Hardware Prediction Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <GlassCard
            title="Latest Hardware Capture & Inference"
            subtitle="Most recent wildlife footprint processed from the edge camera"
            icon={Cpu}
          >
            {latestPred ? (
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-slate-950/70 border border-indigo-950/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Species Identified
                    </span>
                    <h3 className="text-2xl font-black text-white mt-1 uppercase">
                      {latestPred.prediction}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Recorded at: {new Date(latestPred.timestamp).toLocaleString()}
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Confidence
                    </span>
                    <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                      {latestPred.confidence.toFixed(2)}%
                    </div>
                    <p className="text-xs font-mono text-indigo-300 mt-1">
                      Latency: {latestPred.inference_time_ms} ms
                    </p>
                  </div>
                </div>

                {/* Softmax probabilities for hardware capture */}
                {latestPred.probabilities && (
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-indigo-950/60">
                    <span className="text-xs font-semibold text-slate-300 block mb-2">
                      Class Distribution
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[11px]">Deer</span>
                        <span className="font-bold text-sky-400 font-mono">
                          {latestPred.probabilities.Deer}%
                        </span>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[11px]">Tiger</span>
                        <span className="font-bold text-amber-400 font-mono">
                          {latestPred.probabilities.Tiger}%
                        </span>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-400 block text-[11px]">Wolf</span>
                        <span className="font-bold text-purple-400 font-mono">
                          {latestPred.probabilities.Wolf}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 border-2 border-dashed border-indigo-950/60 rounded-xl bg-slate-950/30">
                <HelpCircle className="w-10 h-10 mx-auto text-slate-400 mb-3" />
                <h4 className="text-sm font-semibold text-slate-200">NO HARDWARE DATA YET</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  When the Raspberry Pi 3 camera station captures a footprint and sends it to the API,
                  it will be displayed here in real time.
                </p>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right side: Hardware Specifications & Wiring Guide */}
        <div className="lg:col-span-5">
          <GlassCard
            title="Field Station Hardware Specs"
            subtitle="Verified Raspberry Pi 3 Edge Configuration"
            icon={Cpu}
          >
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950/70 border border-indigo-950/70 flex items-center justify-between">
                <span className="text-slate-400">Microcontroller</span>
                <span className="font-semibold text-slate-200">Raspberry Pi 3 Model B</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/70 border border-indigo-950/70 flex items-center justify-between">
                <span className="text-slate-400">Optical Sensor</span>
                <span className="font-semibold text-slate-200">Pi Camera Module v2 / USB</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/70 border border-indigo-950/70 flex items-center justify-between">
                <span className="text-slate-400">Storage Medium</span>
                <span className="font-semibold text-slate-200">32 GB Micro-SD Card (Class 10)</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/70 border border-indigo-950/70 flex items-center justify-between">
                <span className="text-slate-400">Client Script</span>
                <span className="font-mono text-indigo-300">raspberry_pi/pi_client.py</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950/70 border border-indigo-950/70 flex items-center justify-between">
                <span className="text-slate-400">Target Endpoint</span>
                <span className="font-mono text-indigo-300">POST /predict (source=raspberry_pi)</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
