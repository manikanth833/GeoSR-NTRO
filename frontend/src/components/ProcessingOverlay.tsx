import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Cpu, ShieldCheck, Layers, ArrowRight } from 'lucide-react';
import { InferenceResponse } from '../types';

interface ProcessingOverlayProps {
  onComplete: () => void;
  result: InferenceResponse | null;
}

export const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ onComplete, result }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const steps = result?.telemetry_logs || [
    "[0.00s] [INIT] Initializing GeoSR-NTRO inference pipeline...",
    "[0.15s] [DATA] Fetching Sentinel-2 L2A 10m RGBN observation",
    "[0.40s] [PREPROC] Applying surface reflectance alignment",
    "[0.85s] [MAMBA] Passing 10m input through SEN2SR / Mamba backbone",
    "[1.30s] [ADAPTER] Applying Bounded Refinement Adapter (~11.5k params)",
    "[1.75s] [CONSTRAINT] Enforcing SEN2SR Hard Low-Frequency Consistency",
    "[2.10s] [UNCERTAINTY] Estimating model confidence proxy",
    "[2.45s] [ANALYTICS] Computing 2.5m spectral indices",
    "[2.70s] [COMPLETE] Super-resolution 2.5m geospatial representation complete."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => onComplete(), 1000);
          return prev;
        }
      });
    }, 350);

    return () => clearInterval(interval);
  }, [steps.length]);

  const progressPercent = Math.min(100, Math.round(((currentStepIndex + 1) / steps.length) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-lg flex items-center justify-center p-4 select-none">
      <div className="bg-[#070B14] border border-[#00F0FF]/40 rounded-xl max-w-xl w-full p-6 shadow-glow-cyan space-y-6 font-mono">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#00F0FF]/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00F0FF]/15 rounded-lg border border-[#00F0FF]/30 text-[#00F0FF]">
              <Sparkles className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">MISSION INFERENCE TELEMETRY</h3>
              <p className="text-xs text-gray-400">GeoSR-NTRO 2.5m Super-Resolution Pipeline</p>
            </div>
          </div>
          <span className="text-xs bg-[#00F0FF]/10 text-[#00F0FF] px-2.5 py-1 rounded border border-[#00F0FF]/30 font-bold">
            {progressPercent}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="h-2 w-full bg-[#0A0F1A] rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-[#00F0FF] via-[#00FF9D] to-[#00F0FF] transition-all duration-300 shadow-glow-cyan"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-gray-500">
            <span>INPUT: 10 m SENTINEL-2</span>
            <span>TARGET: 2.5 m GEOSR</span>
          </div>
        </div>

        {/* Telemetry Log Stream */}
        <div className="bg-[#0A0F1A] p-3 rounded-lg border border-white/10 h-48 overflow-y-auto space-y-1.5 text-xs text-gray-300 scrollbar-thin">
          {steps.map((log, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2 text-[11px] transition-opacity ${
                idx === currentStepIndex
                  ? 'text-[#00F0FF] font-bold'
                  : idx < currentStepIndex
                  ? 'text-[#00FF9D]/80'
                  : 'text-gray-600 opacity-40'
              }`}
            >
              {idx <= currentStepIndex ? (
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-[#00FF9D] shrink-0" />
              ) : (
                <span className="w-3.5 h-3.5 rounded-full border border-gray-700 shrink-0 mt-0.5" />
              )}
              <span>{log}</span>
            </div>
          ))}
        </div>

        {/* Completion Action */}
        {currentStepIndex === steps.length - 1 && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={onComplete}
              className="px-5 py-2.5 bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/60 hover:bg-[#00FF9D]/30 rounded font-bold text-xs flex items-center gap-2 shadow-glow-green transition-all"
            >
              <span>REVEAL 2.5 m REPRESENTATION</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
