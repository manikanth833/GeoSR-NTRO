import React from 'react';
import { SceneMetadata, ValidationMetrics, PixelInspectionResponse } from '../types';
import { WhyTrustCard } from './WhyTrustCard';
import { MetricsPanel } from './MetricsPanel';
import { ConfidenceLegend } from './ConfidenceLegend';
import { api } from '../services/api';
import { Download, FileText, Globe, Crosshair } from 'lucide-react';

interface IntelligencePanelProps {
  scene: SceneMetadata;
  metrics: ValidationMetrics | null;
  inspectedPixel: PixelInspectionResponse | null;
  activeLayers: {
    confidence: boolean;
    ndvi: boolean;
    ndwi: boolean;
    segmentation: boolean;
  };
}

export const IntelligencePanel: React.FC<IntelligencePanelProps> = ({
  scene,
  metrics,
  inspectedPixel,
  activeLayers
}) => {
  return (
    <aside className="w-80 bg-[#070B14]/95 border-l border-[#00F0FF]/20 flex flex-col h-full overflow-y-auto text-xs select-none backdrop-blur-md shrink-0">
      {/* Compact Panel Header */}
      <div className="px-3 py-2 border-b border-[#00F0FF]/15 flex items-center justify-between bg-[#0A0F1A]">
        <div className="flex items-center gap-1.5 text-[#00F0FF] font-mono font-bold text-xs tracking-wider">
          <Globe className="w-3.5 h-3.5" />
          <span>INTELLIGENCE CONSOLE</span>
        </div>
        <span className="text-[9px] font-mono bg-[#00F0FF]/10 text-[#00F0FF] px-1.5 py-0.2 rounded border border-[#00F0FF]/30">
          SENTINEL-2 L2A
        </span>
      </div>

      <div className="p-2.5 space-y-2.5 flex-1">
        {/* Pixel Spectral Inspector Card */}
        {inspectedPixel ? (
          <div className="bg-[#0A0F1A] border border-[#00F0FF]/40 rounded-lg p-2 space-y-1.5 font-mono">
            <div className="flex items-center justify-between border-b border-white/10 pb-1 text-[10px] text-[#00F0FF] font-bold">
              <div className="flex items-center gap-1">
                <Crosshair className="w-3 h-3" />
                <span>PIXEL INSPECTOR</span>
              </div>
              <span className="text-gray-400 text-[9px]">
                {inspectedPixel.lat.toFixed(4)}°, {inspectedPixel.lon.toFixed(4)}°
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <div className="p-1 bg-[#070B14] rounded border border-white/5">
                <span className="text-gray-500 block text-[8px]">NDVI</span>
                <span className="font-bold text-[#00FF9D]">{inspectedPixel.ndvi}</span>
              </div>
              <div className="p-1 bg-[#070B14] rounded border border-white/5">
                <span className="text-gray-500 block text-[8px]">NDWI</span>
                <span className="font-bold text-cyan-400">{inspectedPixel.ndwi}</span>
              </div>
            </div>

            <div className="p-1.5 bg-[#070B14] rounded border border-white/5 space-y-0.5 text-[9px]">
              <div className="flex justify-between">
                <span className="text-gray-400">Vegetation:</span>
                <span className="text-white font-medium truncate">{inspectedPixel.vegetation_class}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Surface:</span>
                <span className="text-white font-medium truncate">{inspectedPixel.water_class}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-2 bg-[#0A0F1A] rounded border border-dashed border-white/10 text-center font-mono text-[9px] text-gray-500">
            Click map coordinate to inspect 2.5m pixel reflectance & spectral indices.
          </div>
        )}

        {/* Why Trust Card */}
        <WhyTrustCard />

        {/* Evaluation Metrics */}
        {metrics && <MetricsPanel metrics={metrics} />}

        {/* Confidence Legend if active */}
        {activeLayers.confidence && <ConfidenceLegend />}

        {/* Export & Download Options */}
        <div className="bg-[#0A0F1A] border border-white/10 rounded-lg p-2.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-white font-mono font-bold text-xs border-b border-white/10 pb-1">
            <Download className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>EXPORT & GEOTIFF</span>
          </div>

          <div className="space-y-1 font-mono text-[11px]">
            <a
              href={api.getDownloadUrl(scene.scene_id, 'geotiff')}
              download
              className="flex items-center justify-between p-2 bg-[#00F0FF]/10 rounded border border-[#00F0FF]/30 hover:bg-[#00F0FF]/20 text-[#00F0FF] transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>2.5 m GEOTIFF</span>
              </div>
              <span className="text-[9px] text-gray-400">TIFF</span>
            </a>

            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <a
                href={api.getDownloadUrl(scene.scene_id, 'uncertainty')}
                download
                className="flex items-center justify-center gap-1 p-1.5 bg-[#070B14] rounded border border-white/10 hover:border-white/20 text-gray-300 transition-colors"
              >
                <Download className="w-3 h-3 text-purple-400" />
                <span>Heatmap</span>
              </a>

              <a
                href={api.getDownloadUrl(scene.scene_id, 'metadata')}
                download
                className="flex items-center justify-center gap-1 p-1.5 bg-[#070B14] rounded border border-white/10 hover:border-white/20 text-gray-300 transition-colors"
              >
                <FileText className="w-3 h-3 text-[#00FF9D]" />
                <span>Metadata</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
