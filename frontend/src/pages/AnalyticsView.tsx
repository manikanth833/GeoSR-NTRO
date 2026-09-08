import React, { useState } from 'react';
import { SceneMetadata } from '../types';
import { api } from '../services/api';
import { BarChart2, Activity, Droplets, TreePine, Building2 } from 'lucide-react';

interface AnalyticsViewProps {
  scene: SceneMetadata;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ scene }) => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<'ndvi' | 'ndwi' | 'uncertainty' | 'segmentation'>('ndvi');

  return (
    <div className="flex-1 flex flex-col bg-[#05080E] overflow-y-auto p-4 space-y-4 font-sans select-none max-w-7xl mx-auto w-full">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#070B14] p-3 rounded-xl border border-[#00F0FF]/30 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#00F0FF]" />
            <h2 className="text-base font-bold font-mono text-white">SPECTRAL ANALYTICS & DOWNSTREAM INTELLIGENCE</h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Evaluate 2.5m super-resolved spectral representations for vegetation, water body, and infrastructure understanding.
          </p>
        </div>

        {/* Sub-navigation */}
        <div className="flex items-center gap-1 font-mono text-xs bg-[#0A0F1A] p-0.5 rounded border border-white/10">
          <button
            onClick={() => setSelectedAnalysis('ndvi')}
            className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 text-[11px] ${
              selectedAnalysis === 'ndvi' ? 'bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/40 font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            <TreePine className="w-3 h-3" />
            <span>NDVI</span>
          </button>

          <button
            onClick={() => setSelectedAnalysis('ndwi')}
            className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 text-[11px] ${
              selectedAnalysis === 'ndwi' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Droplets className="w-3 h-3" />
            <span>NDWI</span>
          </button>

          <button
            onClick={() => setSelectedAnalysis('uncertainty')}
            className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 text-[11px] ${
              selectedAnalysis === 'uncertainty' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40 font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Activity className="w-3 h-3" />
            <span>CONFIDENCE</span>
          </button>

          <button
            onClick={() => setSelectedAnalysis('segmentation')}
            className={`px-2.5 py-1 rounded transition-all flex items-center gap-1 text-[11px] ${
              selectedAnalysis === 'segmentation' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3 h-3" />
            <span>INFRASTRUCTURE</span>
          </button>
        </div>
      </div>

      {/* Main Analysis Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Raster View */}
        <div className="lg:col-span-2 bg-[#070B14] rounded-xl border border-white/10 p-3 space-y-2 flex flex-col">
          <div className="flex items-center justify-between font-mono text-xs border-b border-white/10 pb-1.5">
            <span className="font-bold text-white uppercase">{selectedAnalysis} ANALYTICAL RASTER (2.5 m)</span>
            <span className="text-gray-400">Scene: {scene.name}</span>
          </div>

          <div className="relative aspect-square w-full bg-[#05080E] rounded-lg overflow-hidden flex items-center justify-center border border-white/5 max-h-[520px]">
            <img
              src={api.getLayerTileUrl(scene.scene_id, selectedAnalysis)}
              alt={selectedAnalysis}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right 1 Col: Interpretation & Legend Card */}
        <div className="bg-[#070B14] rounded-xl border border-white/10 p-4 space-y-3 font-sans text-xs">
          <h3 className="font-mono font-bold text-xs text-white border-b border-white/10 pb-1.5">
            SCIENTIFIC INTERPRETATION
          </h3>

          {selectedAnalysis === 'ndvi' && (
            <div className="space-y-2 font-mono">
              <div className="p-2.5 bg-[#0A0F1A] rounded border border-[#00FF9D]/30 space-y-0.5">
                <span className="text-[#00FF9D] font-bold block text-xs">NORMALIZED DIFFERENCE VEGETATION INDEX</span>
                <p className="text-[10px] text-gray-300 font-sans">
                  Formula: (B08_NIR - B04_Red) / (B08_NIR + B04_Red). Measures photosynthetic activity and canopy density.
                </p>
              </div>

              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between p-1.5 bg-[#0A0F1A] rounded text-blue-400">
                  <span>Water Bodies (&lt; 0.0)</span>
                  <span>Non-vegetated</span>
                </div>
                <div className="flex justify-between p-1.5 bg-[#0A0F1A] rounded text-amber-300">
                  <span>Bare Soil (0.0 - 0.2)</span>
                  <span>Low Vegetation</span>
                </div>
                <div className="flex justify-between p-1.5 bg-[#0A0F1A] rounded text-[#00FF9D]">
                  <span>Dense Crop Canopy (&gt; 0.5)</span>
                  <span>Photosynthetic</span>
                </div>
              </div>
            </div>
          )}

          {selectedAnalysis === 'ndwi' && (
            <div className="space-y-2 font-mono">
              <div className="p-2.5 bg-[#0A0F1A] rounded border border-cyan-400/30 space-y-0.5">
                <span className="text-cyan-400 font-bold block text-xs">NORMALIZED DIFFERENCE WATER INDEX</span>
                <p className="text-[10px] text-gray-300 font-sans">
                  Formula: (B03_Green - B08_NIR) / (B03_Green + B08_NIR). Highlights open water bodies, rivers, and soil moisture.
                </p>
              </div>

              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between p-1.5 bg-[#0A0F1A] rounded text-gray-400">
                  <span>Dry Land Surface (&lt; 0.0)</span>
                  <span>Non-water</span>
                </div>
                <div className="flex justify-between p-1.5 bg-[#0A0F1A] rounded text-cyan-300">
                  <span>Moist Wetlands (0.0 - 0.3)</span>
                  <span>Saturated</span>
                </div>
                <div className="flex justify-between p-1.5 bg-[#0A0F1A] rounded text-blue-400 font-bold">
                  <span>Open Water Bodies (&gt; 0.3)</span>
                  <span>River / Coastal</span>
                </div>
              </div>
            </div>
          )}

          {selectedAnalysis === 'uncertainty' && (
            <div className="space-y-2 font-mono">
              <div className="p-2.5 bg-[#0A0F1A] rounded border border-purple-400/30 space-y-0.5">
                <span className="text-purple-400 font-bold block text-xs">MODEL-ESTIMATED CONFIDENCE PROXY</span>
                <p className="text-[10px] text-gray-300 font-sans">
                  Calculates local spatial variance across feature maps. Higher uncertainty proxy occurs near sharp contrast edges.
                </p>
              </div>
              <p className="text-[10px] text-gray-400 italic">
                * Note: We avoid claiming calibrated statistical epistemic uncertainty; this representation acts as a spatial confidence proxy.
              </p>
            </div>
          )}

          {selectedAnalysis === 'segmentation' && (
            <div className="space-y-2 font-mono">
              <div className="p-2.5 bg-[#0A0F1A] rounded border border-amber-400/30 space-y-0.5">
                <span className="text-amber-400 font-bold block text-xs">DOWNSTREAM FEATURE UNDERSTANDING</span>
                <p className="text-[10px] text-gray-300 font-sans">
                  Tests downstream building footprint extraction and highway road segmentation on 2.5m GeoSR outputs.
                </p>
              </div>
              <div className="p-2 bg-[#0A0F1A] rounded text-[10px] text-[#00FF9D] font-bold border border-[#00FF9D]/30">
                Downstream validation module operational.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
