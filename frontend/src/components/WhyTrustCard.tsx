import React from 'react';
import { ShieldCheck, ArrowDown } from 'lucide-react';

export const WhyTrustCard: React.FC = () => {
  return (
    <div className="bg-[#0A0F1A] border border-[#00F0FF]/30 rounded-lg p-2.5 space-y-2 font-sans select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#00F0FF]/15 pb-1.5">
        <div className="flex items-center gap-1.5 text-white font-mono font-bold text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00F0FF]" />
          <span>WHY TRUST THIS RESULT?</span>
        </div>
        <span className="text-[9px] font-mono bg-[#00FF9D]/10 text-[#00FF9D] px-1.5 py-0.2 rounded border border-[#00FF9D]/30">
          CONSTRAINED SR
        </span>
      </div>

      {/* 3 Pipeline Stages */}
      <div className="space-y-1 text-xs">
        {/* Stage 01 */}
        <div className="p-2 rounded bg-[#070B14] border border-white/5 space-y-0.5">
          <div className="flex items-center justify-between font-mono font-bold text-[10px]">
            <span className="text-[#00F0FF]">01 — MAMBA BACKBONE</span>
            <span className="text-[9px] text-gray-500 font-normal">SEN2SR</span>
          </div>
          <p className="text-[10px] text-gray-300 font-sans leading-tight">
            Reconstructs fine spatial structure from Sentinel-2 observations.
          </p>
        </div>

        <div className="flex justify-center my-0.5">
          <ArrowDown className="w-3 h-3 text-[#00F0FF]/40" />
        </div>

        {/* Stage 02 */}
        <div className="p-2 rounded bg-[#070B14] border border-white/5 space-y-0.5">
          <div className="flex items-center justify-between font-mono font-bold text-[10px]">
            <span className="text-[#00F0FF]">02 — BOUNDED REFINEMENT</span>
            <span className="text-[9px] text-gray-500 font-normal">~11,588 PARAMS</span>
          </div>
          <p className="text-[10px] text-gray-300 font-sans leading-tight">
            Applies a strictly limited residual correction rather than unconstrained sharpening.
          </p>
        </div>

        <div className="flex justify-center my-0.5">
          <ArrowDown className="w-3 h-3 text-[#00F0FF]/40" />
        </div>

        {/* Stage 03 */}
        <div className="p-2 rounded bg-[#00FF9D]/10 border border-[#00FF9D]/40 space-y-0.5">
          <div className="flex items-center justify-between font-mono font-bold text-[10px]">
            <span className="text-[#00FF9D]">03 — OBSERVATION CONSISTENCY</span>
            <span className="text-[9px] text-[#00FF9D] font-normal">HARD CONSTRAINT</span>
          </div>
          <p className="text-[10px] text-gray-300 font-sans leading-tight">
            Constrains the 2.5m representation to remain consistent with the original 10m observation.
          </p>
        </div>
      </div>

      {/* Quote */}
      <div className="p-2 bg-[#070B14] rounded border border-white/10 font-mono text-[9px] text-gray-300 italic leading-snug">
        "We don't hallucinate a sharper image. We generate a 2.5m representation constrained by what the satellite actually observed."
      </div>
    </div>
  );
};
