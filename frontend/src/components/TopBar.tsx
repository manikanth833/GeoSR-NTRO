import React, { useState, useEffect } from 'react';
import { ActiveTab } from '../types';
import { Satellite, Cpu, Radio, ShieldCheck, Clock, MapPin, Layers, BarChart2, Info, Activity } from 'lucide-react';

interface TopBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  demoMode: boolean;
  mouseCoords: { lat: number; lon: number } | null;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  setActiveTab,
  demoMode,
  mouseCoords
}) => {
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setUtcTime(now.toISOString().substring(11, 19) + ' UTC');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-[#070B14]/95 backdrop-blur-md border-b border-[#00F0FF]/20 sticky top-0 z-50 px-3 py-1 text-xs select-none">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left Section: Branding & Badges */}
        <div className="flex items-center gap-2.5">
          <div className="p-1 bg-[#00F0FF]/10 rounded border border-[#00F0FF]/30 text-[#00F0FF]">
            <Satellite className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tracking-wider text-sm text-white font-mono">GeoSR-NTRO</span>
              <span className="text-[9px] bg-[#00F0FF]/15 text-[#00F0FF] px-1 py-0.2 rounded border border-[#00F0FF]/30 font-mono font-semibold">
                PS 26142
              </span>
            </div>
            <p className="text-[10px] text-[#94A3B8] tracking-tight hidden md:block">
              Trustworthy Deep Learning Super-Resolution for Sentinel-2
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 pl-2 border-l border-white/10 text-[10px] font-mono text-gray-400">
            <span>SIH 2026</span>
            <span className="text-gray-600">•</span>
            <span>NTRO</span>
            <span className="text-gray-600">•</span>
            <span className="text-[#00FF9D]">SPACE TECH</span>
          </div>
        </div>

        {/* Center Section: Compact Navigation Tabs */}
        <nav className="flex items-center bg-[#0D1424] p-0.5 rounded border border-[#00F0FF]/15">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium text-[11px] transition-all ${
              activeTab === 'OVERVIEW'
                ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40 shadow-glow-cyan font-bold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Activity className="w-3 h-3" />
            <span>OVERVIEW</span>
          </button>

          <button
            onClick={() => setActiveTab('MISSION')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium text-[11px] transition-all ${
              activeTab === 'MISSION'
                ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40 shadow-glow-cyan font-bold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>MISSION CONTROL</span>
          </button>

          <button
            onClick={() => setActiveTab('MODEL_LAB')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium text-[11px] transition-all ${
              activeTab === 'MODEL_LAB'
                ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40 shadow-glow-cyan font-bold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Cpu className="w-3 h-3" />
            <span>MODEL LAB</span>
          </button>

          <button
            onClick={() => setActiveTab('ANALYTICS')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium text-[11px] transition-all ${
              activeTab === 'ANALYTICS'
                ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40 shadow-glow-cyan font-bold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart2 className="w-3 h-3" />
            <span>ANALYTICS</span>
          </button>

          <button
            onClick={() => setActiveTab('ABOUT')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded font-medium text-[11px] transition-all ${
              activeTab === 'ABOUT'
                ? 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40 shadow-glow-cyan font-bold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Info className="w-3 h-3" />
            <span>METHODOLOGY</span>
          </button>
        </nav>

        {/* Right Section: Telemetry & Status Badges */}
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 bg-[#0A0F1A] rounded border border-white/10">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-ping" />
            <span className="text-[#00FF9D]">ONLINE</span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 rounded border border-amber-500/30 text-amber-400 font-bold">
            <ShieldCheck className="w-3 h-3" />
            <span>{demoMode ? 'DEMO MODE' : 'LIVE INFERENCE'}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-black/40 rounded border border-white/10 text-gray-300">
            <Clock className="w-3 h-3 text-[#00F0FF]" />
            <span>{utcTime}</span>
          </div>

          {mouseCoords && (
            <div className="hidden xl:flex items-center gap-1 px-2 py-0.5 bg-[#00F0FF]/10 rounded border border-[#00F0FF]/30 text-[#00F0FF]">
              <MapPin className="w-2.5 h-2.5" />
              <span>
                {mouseCoords.lat.toFixed(4)}°, {mouseCoords.lon.toFixed(4)}°
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
