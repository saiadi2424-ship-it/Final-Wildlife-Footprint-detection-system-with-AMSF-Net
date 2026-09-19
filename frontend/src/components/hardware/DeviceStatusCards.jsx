import React from 'react';
import { Cpu, Camera, Wifi, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function DeviceStatusCards({ telemetry, isDemo }) {
  const isConnected = isDemo || telemetry.device_status === 'CONNECTED';
  const isCameraActive = isDemo || telemetry.camera_status === 'ACTIVE';
  const isNetworkConnected = isDemo || telemetry.network_status === 'CONNECTED';
  const latestPred = telemetry.latest_prediction;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Raspberry Pi 3 */}
      <div className="glass-panel rounded-xl p-5 border border-indigo-950/80">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Device</span>
          <StatusBadge
            status={isConnected ? (isDemo ? 'SIMULATED' : 'CONNECTED') : 'WAITING'}
            label={isConnected ? (isDemo ? 'CONNECTED (SIM)' : 'CONNECTED') : 'WAITING FOR DEVICE'}
          />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className={`p-3 rounded-lg border ${isConnected ? 'bg-emerald-950/50 border-emerald-800/40 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Raspberry Pi 3</h4>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {isConnected ? (isDemo ? '192.168.1.105 (Demo)' : 'rpi3-wildlife-01') : 'Device offline'}
            </p>
          </div>
        </div>
      </div>

      {/* Card 2: Camera Status */}
      <div className="glass-panel rounded-xl p-5 border border-indigo-950/80">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Camera Sensor</span>
          <StatusBadge
            status={isCameraActive ? (isDemo ? 'SIMULATED' : 'ACTIVE') : 'WAITING'}
            label={isCameraActive ? 'ACTIVE' : 'WAITING'}
          />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className={`p-3 rounded-lg border ${isCameraActive ? 'bg-indigo-950/50 border-indigo-800/40 text-indigo-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Pi Camera Module</h4>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {isCameraActive ? '1080p Video/Still' : 'No camera detected'}
            </p>
          </div>
        </div>
      </div>

      {/* Card 3: Network Status */}
      <div className="glass-panel rounded-xl p-5 border border-indigo-950/80">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Network Connection</span>
          <StatusBadge
            status={isNetworkConnected ? (isDemo ? 'SIMULATED' : 'CONNECTED') : 'WAITING'}
            label={isNetworkConnected ? 'CONNECTED' : 'WAITING'}
          />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className={`p-3 rounded-lg border ${isNetworkConnected ? 'bg-purple-950/50 border-purple-800/40 text-purple-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
            <Wifi className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Edge Stream</h4>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {isNetworkConnected ? 'HTTP/REST Stream' : 'Awaiting uplink'}
            </p>
          </div>
        </div>
      </div>

      {/* Card 4: Latest Hardware Prediction */}
      <div className="glass-panel rounded-xl p-5 border border-indigo-950/80">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Latest Hardware Pred</span>
          {latestPred ? (
            <span className="text-xs font-mono font-bold text-emerald-400">{latestPred.confidence}%</span>
          ) : (
            <span className="text-xs text-slate-500">NO DATA</span>
          )}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className={`p-3 rounded-lg border ${latestPred ? 'bg-amber-950/50 border-amber-800/40 text-amber-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase">
              {latestPred ? latestPred.prediction : 'NO DATA'}
            </h4>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {latestPred ? `${latestPred.inference_time_ms} ms latency` : 'Waiting for hardware capture'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
