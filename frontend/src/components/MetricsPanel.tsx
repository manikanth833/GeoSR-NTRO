import React from 'react';
import { ValidationMetrics } from '../types';
import { Award } from 'lucide-react';

interface MetricsPanelProps {
  metrics: ValidationMetrics;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ metrics }) => {
  const geoSR = metrics.methods["GeoSR-NTRO"];

  return (
    <div className="bg-[#0A0F1A] border border-white/10 rounded-lg p-2.5 space-y-2 font-sans select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
        <div className="flex items-center gap-1.5 text-white font-mono font-bold text-xs">
          <Award className="w-3.5 h-3.5 text-[#00FF9D]" />
          <span>EVALUATION METRICS</span>
        </div>
        <span className="text-[8px] font-mono bg-amber-500/10 text-amber-400 px-1 py-0.2 rounded border border-amber-500/30">
          30-PATCH HELD-OUT SUBSET
        </span>
      </div>

      {/* Compact Metrics Grid */}
      <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
        {/* PSNR Card */}
        <div className="p-1.5 bg-[#070B14] rounded border border-[#00F0FF]/30 flex items-center justify-between">
          <div>
            <span className="text-[9px] text-gray-400 block">PSNR</span>
            <span className="font-bold text-white text-xs">{geoSR.PSNR.toFixed(2)} dB</span>
          </div>
          <span className="text-[#00FF9D] text-[9px] font-bold bg-[#00FF9D]/10 px-1 py-0.5 rounded">+0.25 dB</span>
        </div>

        {/* SAM Card */}
        <div className="p-1.5 bg-[#070B14] rounded border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[9px] text-gray-400 block">SAM</span>
            <span className="font-bold text-white text-xs">{geoSR.SAM.toFixed(2)}°</span>
          </div>
          <span className="text-gray-400 text-[9px] font-mono">~UNCH</span>
        </div>

        {/* SSIM Card */}
        <div className="p-1.5 bg-[#070B14] rounded border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[9px] text-gray-400 block">SSIM</span>
            <span className="font-bold text-white text-xs">{geoSR.SSIM.toFixed(4)}</span>
          </div>
          <span className="text-[#00FF9D] text-[9px]">+0.0012</span>
        </div>

        {/* MAE Card */}
        <div className="p-1.5 bg-[#070B14] rounded border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[9px] text-gray-400 block">MAE</span>
            <span className="font-bold text-white text-xs">{geoSR.MAE.toFixed(5)}</span>
          </div>
          <span className="text-[#00FF9D] text-[9px]">-0.0003</span>
        </div>
      </div>

      {/* Observation Consistency Row */}
      <div className="p-1.5 bg-[#070B14] rounded border border-[#00F0FF]/20 flex items-center justify-between font-mono text-[10px]">
        <span className="text-gray-400">OBSERVATION CONSISTENCY:</span>
        <span className="font-bold text-[#00F0FF]">{geoSR.Consistency.toFixed(7)}</span>
      </div>
    </div>
  );
};
