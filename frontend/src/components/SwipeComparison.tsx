import React, { useState, useEffect, useRef } from 'react';
import { SlidersHorizontal } from 'lucide-react';

interface SwipeComparisonProps {
  sliderPos: number; // 0 to 100 percentage
  setSliderPos: (pos: number) => void;
  labelLeft?: string;
  labelRight?: string;
}

export const SwipeComparison: React.FC<SwipeComparisonProps> = ({
  sliderPos,
  setSliderPos,
  labelLeft = "10 m OBSERVATION",
  labelRight = "2.5 m GEOSR"
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let pos = (x / rect.width) * 100;
    pos = Math.max(2, Math.min(98, pos));
    setSliderPos(pos);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const handleGlobalMove = (e: MouseEvent) => {
      if (isDragging) handleMove(e.clientX);
    };
    const handleGlobalUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMove);
      window.addEventListener('mouseup', handleGlobalUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleGlobalMove);
      window.removeEventListener('mouseup', handleGlobalUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-20 select-none overflow-hidden"
    >
      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-[#00F0FF] shadow-glow-cyan pointer-events-auto cursor-ew-resize flex items-center justify-center"
        style={{ left: `${sliderPos}%` }}
        onMouseDown={handleMouseDown}
      >
        {/* Handle pill */}
        <div className="w-9 h-9 rounded-full bg-[#070B14] border-2 border-[#00F0FF] text-[#00F0FF] flex items-center justify-center shadow-lg transition-transform hover:scale-110">
          <SlidersHorizontal className="w-4 h-4 rotate-90" />
        </div>
      </div>

      {/* Floating Badges */}
      <div className="absolute top-4 left-4 bg-[#070B14]/90 border border-white/20 text-white font-mono text-xs px-3 py-1.5 rounded-md shadow-lg flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
        <span className="font-bold tracking-wider">{labelLeft}</span>
      </div>

      <div className="absolute top-4 right-4 bg-[#070B14]/90 border border-[#00F0FF]/40 text-[#00F0FF] font-mono text-xs px-3 py-1.5 rounded-md shadow-lg flex items-center gap-2 shadow-glow-cyan">
        <span className="w-2 h-2 rounded-full bg-[#00FF9D]"></span>
        <span className="font-bold tracking-wider">{labelRight}</span>
      </div>
    </div>
  );
};
