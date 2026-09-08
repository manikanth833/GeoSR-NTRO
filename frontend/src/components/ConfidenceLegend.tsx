import React from 'react';

export const ConfidenceLegend: React.FC = () => {
  return (
    <div className="bg-[#0A0F1A] border border-purple-500/30 rounded-lg p-2.5 space-y-1.5 text-xs select-none">
      <div className="flex items-center justify-between font-mono font-bold text-[#00F0FF] text-[10px]">
        <span>CONFIDENCE PROXY LEGEND</span>
        <span className="text-[8px] text-purple-400 bg-purple-500/10 px-1 py-0.2 rounded">
          MODEL ESTIMATED
        </span>
      </div>

      {/* Color Ramp */}
      <div className="space-y-0.5">
        <div className="h-2.5 w-full rounded bg-gradient-to-r from-[#00F0FF] via-[#00FF9D] via-[#FFB800] to-[#FF3B30] border border-white/10" />
        <div className="flex justify-between font-mono text-[8px] text-gray-400">
          <span>LOW UNCERTAINTY</span>
          <span>HIGH UNCERTAINTY</span>
        </div>
      </div>

      <p className="text-[9px] text-gray-400 font-mono leading-tight">
        Spatial variance proxy indicates locations (edges/shadows) where refinement exhibits higher variance.
      </p>
    </div>
  );
};
