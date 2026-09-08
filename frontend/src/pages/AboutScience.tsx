import React from 'react';
import { ShieldCheck, Cpu, ArrowRight, Layers, Award, CheckCircle2 } from 'lucide-react';

export const AboutScience: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col bg-[#05080E] overflow-y-auto p-4 space-y-5 font-sans select-none max-w-6xl mx-auto w-full">
      {/* Hero Header */}
      <div className="bg-[#070B14] p-4 rounded-xl border border-[#00F0FF]/30 space-y-3 backdrop-blur-md shadow-glow-cyan">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-[#00F0FF] font-bold text-base">GeoSR-NTRO</span>
              <span className="text-[10px] bg-[#00F0FF]/15 text-[#00F0FF] px-1.5 py-0.2 rounded border border-[#00F0FF]/30">
                PS 26142 • SPACE TECHNOLOGY
              </span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight mt-0.5">
              Trustworthy Deep Learning Super-Resolution for Sentinel-2
            </h1>
            <p className="text-xs text-gray-300 mt-0.5">
              From 10 m satellite observations to trustworthy 2.5 m geospatial intelligence.
            </p>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs text-gray-400">
            <span className="px-2.5 py-1 bg-[#0A0F1A] rounded border border-white/10 text-[11px]">SIH 2026</span>
            <span className="px-2.5 py-1 bg-[#0A0F1A] rounded border border-white/10 text-[11px]">NTRO</span>
          </div>
        </div>

        {/* Core Philosophy Banner */}
        <div className="p-3 bg-[#0A0F1A] rounded-lg border border-[#00FF9D]/30 font-mono text-xs text-[#00FF9D] leading-relaxed shadow-glow-green">
          "We don't hallucinate a sharper satellite image. We generate a higher-resolution representation constrained by what the satellite actually observed."
        </div>
      </div>

      {/* System Architecture Visualization */}
      <div className="bg-[#070B14] p-4 rounded-xl border border-white/10 space-y-3 font-mono">
        <div className="flex items-center gap-2 text-white font-bold text-xs border-b border-white/10 pb-2">
          <Layers className="w-3.5 h-3.5 text-[#00F0FF]" />
          <span>SYSTEM ARCHITECTURE & PIPELINE FLOWCHART</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs py-2">
          <div className="p-2.5 bg-[#0A0F1A] rounded-lg border border-amber-500/30 text-center min-w-[110px]">
            <span className="text-amber-400 font-bold block text-[9px]">DATA SOURCE</span>
            <span className="text-white text-[11px]">Sentinel-2 10m</span>
          </div>

          <ArrowRight className="w-3.5 h-3.5 text-[#00F0FF]/60" />

          <div className="p-2.5 bg-[#0A0F1A] rounded-lg border border-white/10 text-center min-w-[120px]">
            <span className="text-gray-400 font-bold block text-[9px]">PREPROCESSING</span>
            <span className="text-white text-[11px]">RGBN (B4,B3,B2,B8)</span>
          </div>

          <ArrowRight className="w-3.5 h-3.5 text-[#00F0FF]/60" />

          <div className="p-2.5 bg-[#0A0F1A] rounded-lg border border-[#00F0FF]/40 text-center min-w-[130px] bg-[#00F0FF]/5">
            <span className="text-[#00F0FF] font-bold block text-[9px]">BACKBONE</span>
            <span className="text-white text-[11px]">SEN2SR / Mamba</span>
          </div>

          <ArrowRight className="w-3.5 h-3.5 text-[#00F0FF]/60" />

          <div className="p-2.5 bg-[#0A0F1A] rounded-lg border border-purple-400/40 text-center min-w-[130px]">
            <span className="text-purple-400 font-bold block text-[9px]">TRUST LAYER</span>
            <span className="text-white text-[11px]">Bounded Adapter</span>
          </div>

          <ArrowRight className="w-3.5 h-3.5 text-[#00F0FF]/60" />

          <div className="p-2.5 bg-[#0A0F1A] rounded-lg border border-[#00FF9D]/40 text-center min-w-[130px] bg-[#00FF9D]/5">
            <span className="text-[#00FF9D] font-bold block text-[9px]">HARD CONSTRAINT</span>
            <span className="text-white text-[11px]">Low-Freq Projection</span>
          </div>

          <ArrowRight className="w-3.5 h-3.5 text-[#00F0FF]/60" />

          <div className="p-2.5 bg-[#00F0FF]/20 rounded-lg border border-[#00F0FF] text-center min-w-[120px] text-[#00F0FF] font-bold">
            <span className="text-[9px] block text-[#00FF9D]">OUTPUT</span>
            <span className="text-[11px]">2.5 m GeoSR</span>
          </div>
        </div>
      </div>

      {/* 3 Pillars of Trustworthiness */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
        <div className="bg-[#070B14] p-4 rounded-xl border border-white/10 space-y-1.5">
          <div className="flex items-center gap-1.5 font-mono font-bold text-[#00F0FF] text-xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>01. BOUNDED REFINEMENT</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            The GeoSR refinement adapter (~11,588 trainable parameters, max residual 0.05) learns bounded residual updates around frozen pretrained Mamba weights.
          </p>
        </div>

        <div className="bg-[#070B14] p-4 rounded-xl border border-white/10 space-y-1.5">
          <div className="flex items-center gap-1.5 font-mono font-bold text-[#00FF9D] text-xs">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>02. HARD CONSISTENCY</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            SEN2SR HardConstraint enforces low-frequency observation consistency: downsampling the 2.5m output mathematically reproduces the original 10m Sentinel-2 observation.
          </p>
        </div>

        <div className="bg-[#070B14] p-4 rounded-xl border border-white/10 space-y-1.5">
          <div className="flex items-center gap-1.5 font-mono font-bold text-purple-400 text-xs">
            <Cpu className="w-3.5 h-3.5" />
            <span>03. CONFIDENCE PROXY</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Calculates model variance and spatial gradient proxies to indicate locations where the model experiences higher reconstruction uncertainty.
          </p>
        </div>
      </div>

      {/* Verified Evaluation Table */}
      <div className="bg-[#070B14] p-4 rounded-xl border border-white/10 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2 text-white font-bold text-xs">
            <Award className="w-3.5 h-3.5 text-[#00FF9D]" />
            <span>HELD-OUT EVALUATION SUBSET (30 PATCHES)</span>
          </div>
          <span className="text-amber-400 font-bold">PSNR GAIN: +0.248 dB</span>
        </div>

        <p className="text-gray-300 font-sans leading-relaxed text-xs">
          On a held-out validation subset of 30 Sentinel-2 patches, GeoSR-NTRO improved PSNR by approximately 0.25 dB over the Mamba + Hard Constraint baseline, while guaranteeing observation consistency with source Sentinel-2 L2A signals.
        </p>
      </div>
    </div>
  );
};
