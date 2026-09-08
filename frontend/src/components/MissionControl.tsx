import React from 'react';
import { SceneMetadata } from '../types';
import { Layers, Play, Cpu, Eye, Sparkles, MapPin, Sliders } from 'lucide-react';

interface MissionControlProps {
  scenes: SceneMetadata[];
  selectedScene: SceneMetadata;
  setSelectedScene: (scene: SceneMetadata) => void;
  activeLayers: {
    obs10m: boolean;
    geosr25m: boolean;
    confidence: boolean;
    ndvi: boolean;
    ndwi: boolean;
    segmentation: boolean;
  };
  setActiveLayers: React.Dispatch<React.SetStateAction<{
    obs10m: boolean;
    geosr25m: boolean;
    confidence: boolean;
    ndvi: boolean;
    ndwi: boolean;
    segmentation: boolean;
  }>>;
  onRunInference: () => void;
  isProcessing: boolean;
}

export const MissionControl: React.FC<MissionControlProps> = ({
  scenes,
  selectedScene,
  setSelectedScene,
  activeLayers,
  setActiveLayers,
  onRunInference,
  isProcessing
}) => {
  const toggleLayer = (key: keyof typeof activeLayers) => {
    setActiveLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside className="w-72 bg-[#070B14]/95 border-r border-[#00F0FF]/20 flex flex-col h-full overflow-y-auto text-xs select-none backdrop-blur-md shrink-0">
      {/* Compact Panel Header */}
      <div className="px-3 py-2 border-b border-[#00F0FF]/15 flex items-center justify-between bg-[#0A0F1A]">
        <div className="flex items-center gap-1.5 text-[#00F0FF] font-mono font-bold text-xs tracking-wider">
          <Sliders className="w-3.5 h-3.5" />
          <span>MISSION CONTROL</span>
        </div>
        <span className="text-[9px] bg-[#00FF9D]/10 text-[#00FF9D] px-1.5 py-0.2 rounded border border-[#00FF9D]/30 font-mono">
          READY
        </span>
      </div>

      <div className="p-2.5 space-y-3 flex-1 font-sans">
        {/* Section 1: Scene & Target AOI */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#00F0FF]" />
            <span>Target Scene AOI</span>
          </label>
          <select
            value={selectedScene.scene_id}
            onChange={(e) => {
              const s = scenes.find(x => x.scene_id === e.target.value);
              if (s) setSelectedScene(s);
            }}
            className="w-full bg-[#0A0F1A] border border-[#00F0FF]/30 text-white rounded p-1.5 focus:outline-none focus:border-[#00F0FF] text-[11px]"
          >
            {scenes.map(s => (
              <option key={s.scene_id} value={s.scene_id}>
                {s.name}
              </option>
            ))}
          </select>

          <div className="p-2 bg-[#0A0F1A] rounded border border-white/5 space-y-0.5 font-mono text-[10px] text-gray-300">
            <div className="flex justify-between">
              <span className="text-gray-500">Location:</span>
              <span className="text-white truncate">{selectedScene.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Acquisition:</span>
              <span>{selectedScene.acquisition_date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Cloud Cover:</span>
              <span className="text-[#00FF9D]">{selectedScene.cloud_cover_percentage}%</span>
            </div>
          </div>
        </div>

        {/* Section 2: Resolution Specs */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono font-semibold text-gray-400 uppercase tracking-wider">
            Spatial Resolution
          </label>
          <div className="grid grid-cols-3 gap-1.5 text-center font-mono">
            <div className="p-1.5 bg-[#0A0F1A] rounded border border-white/10">
              <span className="block text-[9px] text-gray-500">INPUT</span>
              <span className="font-bold text-amber-400 text-xs">10 m</span>
            </div>
            <div className="p-1.5 bg-[#0A0F1A] rounded border border-[#00F0FF]/40 text-[#00F0FF] bg-[#00F0FF]/5">
              <span className="block text-[9px] text-gray-400">OUTPUT</span>
              <span className="font-bold text-xs">2.5 m</span>
            </div>
            <div className="p-1.5 bg-[#0A0F1A] rounded border border-white/10">
              <span className="block text-[9px] text-gray-500">SCALE</span>
              <span className="font-bold text-[#00FF9D] text-xs">4×</span>
            </div>
          </div>
        </div>

        {/* Section 3: Model Configuration */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <Cpu className="w-3 h-3 text-[#00F0FF]" />
            <span>Model Configuration</span>
          </label>
          <div className="p-2 bg-[#0A0F1A] rounded border border-white/10 space-y-1 text-[10px] font-mono">
            <div className="flex justify-between">
              <span className="text-gray-400">Backbone:</span>
              <span className="text-white font-semibold">SEN2SR / Mamba</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Adapter Params:</span>
              <span className="text-gray-300">~11,588 (bounded)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Hard Constraint:</span>
              <span className="text-[#00FF9D] font-bold">ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Section 4: Visual Layer Controls */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
            <Eye className="w-3 h-3 text-[#00F0FF]" />
            <span>Visual Layer Controls</span>
          </label>
          <div className="space-y-1 text-[11px]">
            <label className="flex items-center justify-between p-1.5 bg-[#0A0F1A] rounded border border-white/5 hover:border-white/20 cursor-pointer">
              <span className="flex items-center gap-1.5 text-gray-300">
                <input
                  type="checkbox"
                  checked={activeLayers.obs10m}
                  onChange={() => toggleLayer('obs10m')}
                  className="rounded accent-[#00F0FF]"
                />
                10 m Observation
              </span>
              <span className="text-[9px] font-mono text-amber-400 bg-amber-400/10 px-1 rounded">10m</span>
            </label>

            <label className="flex items-center justify-between p-1.5 bg-[#0A0F1A] rounded border border-[#00F0FF]/30 hover:border-[#00F0FF] cursor-pointer">
              <span className="flex items-center gap-1.5 text-white font-medium">
                <input
                  type="checkbox"
                  checked={activeLayers.geosr25m}
                  onChange={() => toggleLayer('geosr25m')}
                  className="rounded accent-[#00F0FF]"
                />
                GeoSR 2.5 m Output
              </span>
              <span className="text-[9px] font-mono text-[#00F0FF] bg-[#00F0FF]/15 px-1 rounded">2.5m</span>
            </label>

            <label className="flex items-center justify-between p-1.5 bg-[#0A0F1A] rounded border border-white/5 hover:border-white/20 cursor-pointer">
              <span className="flex items-center gap-1.5 text-gray-300">
                <input
                  type="checkbox"
                  checked={activeLayers.confidence}
                  onChange={() => toggleLayer('confidence')}
                  className="rounded accent-[#00F0FF]"
                />
                Confidence Proxy
              </span>
              <span className="text-[9px] font-mono text-purple-400 bg-purple-400/10 px-1 rounded">HEATMAP</span>
            </label>

            <label className="flex items-center justify-between p-1.5 bg-[#0A0F1A] rounded border border-white/5 hover:border-white/20 cursor-pointer">
              <span className="flex items-center gap-1.5 text-gray-300">
                <input
                  type="checkbox"
                  checked={activeLayers.ndvi}
                  onChange={() => toggleLayer('ndvi')}
                  className="rounded accent-[#00F0FF]"
                />
                NDVI Vegetation
              </span>
              <span className="text-[9px] font-mono text-[#00FF9D] bg-[#00FF9D]/10 px-1 rounded">VEG</span>
            </label>

            <label className="flex items-center justify-between p-1.5 bg-[#0A0F1A] rounded border border-white/5 hover:border-white/20 cursor-pointer">
              <span className="flex items-center gap-1.5 text-gray-300">
                <input
                  type="checkbox"
                  checked={activeLayers.ndwi}
                  onChange={() => toggleLayer('ndwi')}
                  className="rounded accent-[#00F0FF]"
                />
                NDWI Water Body
              </span>
              <span className="text-[9px] font-mono text-cyan-400 bg-cyan-400/10 px-1 rounded">WATER</span>
            </label>

            <label className="flex items-center justify-between p-1.5 bg-[#0A0F1A] rounded border border-white/5 hover:border-white/20 cursor-pointer">
              <span className="flex items-center gap-1.5 text-gray-300">
                <input
                  type="checkbox"
                  checked={activeLayers.segmentation}
                  onChange={() => toggleLayer('segmentation')}
                  className="rounded accent-[#00F0FF]"
                />
                Building / Road Mask
              </span>
              <span className="text-[9px] font-mono text-amber-300 bg-amber-300/10 px-1 rounded">INFRA</span>
            </label>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-2.5 border-t border-[#00F0FF]/15 bg-[#0A0F1A]">
        <button
          onClick={onRunInference}
          disabled={isProcessing}
          className={`w-full py-2 px-3 rounded font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
            isProcessing
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
              : 'bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/60 hover:bg-[#00F0FF]/30 shadow-glow-cyan'
          }`}
        >
          {isProcessing ? (
            <>
              <Sparkles className="w-3.5 h-3.5 animate-spin text-[#00F0FF]" />
              <span>RUNNING TELEMETRY...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>RUN SUPER-RESOLUTION</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
