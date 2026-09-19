import React from 'react';
import {
  Info,
  PawPrint,
  Cpu,
  Server,
  Layout,
  HardDrive,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';

export default function AboutPage() {
  const projectFacts = [
    { label: 'Project Title', value: 'AI-Based Wildlife Footprint Recognition System Using AMSF-Net' },
    { label: 'Proposed Architecture', value: 'AMSF-Net (Adaptive Multi-Scale Feature Fusion Network)' },
    { label: 'Wildlife Target Classes', value: 'Deer • Tiger • Wolf (3 Classes)' },
    { label: 'Deep Learning Framework', value: 'PyTorch (torch & torchvision)' },
    { label: 'Backend API Service', value: 'FastAPI (Asynchronous Python 3.10+)' },
    { label: 'Frontend Interface', value: 'React + Vite + Tailwind CSS + Recharts' },
    { label: 'Edge Hardware Node', value: 'Raspberry Pi 3 Model B' },
    { label: 'Optical Sensor', value: 'Raspberry Pi Camera Module v2' },
    { label: 'Edge Storage', value: '32 GB Micro-SD Card' },
    { label: 'Validation Accuracy', value: '84.13% (Verified on validation set)' },
    { label: 'Trainable Parameters', value: '155,173 parameters' },
    { label: 'Input Dimensions', value: '224 × 224 × 3 RGB' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-950 to-purple-950/60 border border-indigo-900/40">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-xs font-semibold text-indigo-300 mb-3">
          <Info className="w-3.5 h-3.5 text-indigo-400" />
          <span>PROJECT DOCUMENTATION</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          About Wildlife Footprint AI
        </h1>
        <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
          A research-grade AI wildlife monitoring platform engineered for non-invasive, automated animal tracking and conservation.
        </p>
      </div>

      {/* Purpose & Mission */}
      <GlassCard
        title="Project Purpose & Motivation"
        subtitle="Automating wildlife census and conflict prevention"
        icon={PawPrint}
      >
        <div className="space-y-3 text-xs md:text-sm text-slate-300 leading-relaxed">
          <p>
            Traditional wildlife monitoring relies heavily on manual pugmark casting, physical plaster casts,
            and expert tracking. These methods are labor-intensive, slow, subject to observer bias, and frequently
            impossible in remote forested habitats.
          </p>
          <p>
            <strong>AMSF-Net (Adaptive Multi-Scale Feature Fusion Network)</strong> provides an automated,
            AI-driven solution capable of recognizing footprints from photographs captured by edge cameras or field researchers.
            By fusing multi-scale spatial features with channel attention, the network delivers robust discrimination
            between <strong>Deer</strong>, <strong>Tiger</strong>, and <strong>Wolf</strong> tracks under natural, noisy substrate conditions.
          </p>
        </div>
      </GlassCard>

      {/* Verified System Specifications */}
      <GlassCard
        title="System Specifications & Technology Matrix"
        subtitle="Comprehensive technical facts and hardware components"
        icon={Cpu}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {projectFacts.map((fact) => (
            <div
              key={fact.label}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-indigo-950/80 flex items-start justify-between gap-4"
            >
              <span className="text-xs font-medium text-slate-400 shrink-0">{fact.label}</span>
              <span className="text-xs font-semibold text-slate-100 text-right">{fact.value}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Hardware Node Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard
          title="Edge Hardware"
          subtitle="Raspberry Pi 3 Model B"
          icon={Cpu}
        >
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Broadcom BCM2837 Quad-Core @ 1.2GHz</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>1 GB LPDDR2 SDRAM</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>2.4 GHz 802.11n Wi-Fi & Bluetooth 4.1</span>
            </li>
          </ul>
        </GlassCard>

        <GlassCard
          title="Optical Sensor"
          subtitle="Pi Camera Module v2"
          icon={HardDrive}
        >
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Sony IMX219 8-Megapixel Sensor</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Dedicated CSI-2 Ribbon Bus</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Low-power, ground-level mounting</span>
            </li>
          </ul>
        </GlassCard>

        <GlassCard
          title="Deployment Strategy"
          subtitle="Edge Client -> Central Server"
          icon={Server}
        >
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Field Pi streams images via HTTP POST</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Central server handles AMSF-Net inference</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              <span>Dashboard reflects real-time detections</span>
            </li>
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}
