import React, { useState } from 'react';
import { SceneMetadata, ValidationMetrics } from '../types';
import { api } from '../services/api';
import { Cpu, Award, CheckCircle2 } from 'lucide-react';

interface ModelLabProps {
  scene: SceneMetadata;
  metrics: ValidationMetrics | null;
}

export const ModelLab: React.FC<ModelLabProps> = ({ scene, metrics }) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('GeoSR-NTRO');

  const methodsList = [
    {
      id: 'bicubic',
      name: 'Bicubic Interpolation',
      tag: 'Mathematical Baseline',
      psnr: '36.40 dB',
      sam: '2.40°',
      ssim: '0.9777',
      mae: '0.01085',
      consistency: '0.00095',
      desc: 'Standard mathematical spatial interpolation.'
    },
    {
      id: 'mamba_raw',
      name: 'Mamba Raw (SEN2SR)',
      tag: 'Unconstrained Backbone',
      psnr: '21.34 dB',
      sam: '36.43°',
      ssim: '0.4194',
      mae: '0.08366',
      consistency: '0.08201',
      desc: 'Unconstrained Mamba spatial reconstruction.'
    },
    {
      id: 'mamba_hc',
      name: 'Mamba + Hard Constraint',
      tag: 'Official SEN2SR Baseline',
      psnr: '36.11 dB',
      sam: '2.45°',
      ssim: '0.9763',
      mae: '0.01116',
      consistency: '0.00082',
      desc: 'Pretrained Mamba with low-frequency projection.'
    },
    {
      id: 'geosr',
      name: 'GeoSR-NTRO',
      tag: 'Bounded Trust Layer (Ours)',
      psnr: '36.36 dB',
      sam: '2.45°',
      ssim: '0.9775',
      mae: '0.01085',
      consistency: '0.00138',
      desc: 'SEN2SR/Mamba + Bounded Adapter + HardConstraint.'
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#05080E] overflow-y-auto p-4 space-y-4 font-sans select-none max-w-7xl mx-auto w-full">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#070B14] p-3 rounded-xl border border-[#00F0FF]/30 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#00F0FF]" />
            <h2 className="text-base font-bold font-mono text-white">MODEL EXPERIMENTATION & COMPARISON LAB</h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Comparative evaluation of 4 super-resolution paradigms on Sentinel-2 L2A imagery (10m → 2.5m).
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-2.5 py-1 bg-[#0A0F1A] rounded border border-white/10 text-gray-300 text-[11px]">
            <span className="text-gray-500">Evaluation Subset:</span> <span className="text-[#00FF9D]">30 Held-Out Patches</span>
          </div>
          <div className="px-2.5 py-1 bg-[#00F0FF]/15 rounded border border-[#00F0FF]/40 text-[#00F0FF] font-bold text-[11px]">
            PSNR DELTA: +0.248 dB
          </div>
        </div>
      </div>

      {/* 4-Way Quad Viewer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {methodsList.map((m) => {
          const isGeoSR = m.id === 'geosr';
          return (
            <div
              key={m.id}
              onClick={() => setSelectedMethod(m.name)}
              className={`bg-[#070B14] rounded-xl border overflow-hidden flex flex-col transition-all cursor-pointer ${
                isGeoSR
                  ? 'border-[#00F0FF] shadow-glow-cyan bg-[#00F0FF]/5'
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              {/* Tile Header */}
              <div className="p-2.5 border-b border-white/10 bg-[#0A0F1A] flex items-center justify-between font-mono text-xs">
                <div>
                  <h4 className="font-bold text-white text-xs">{m.name}</h4>
                  <span className={`text-[9px] ${isGeoSR ? 'text-[#00F0FF]' : 'text-gray-400'}`}>
                    {m.tag}
                  </span>
                </div>
                {isGeoSR && (
                  <span className="text-[8px] bg-[#00FF9D]/15 text-[#00FF9D] px-1 py-0.2 rounded border border-[#00FF9D]/30 font-bold">
                    PROPOSED
                  </span>
                )}
              </div>

              {/* Image Preview Canvas */}
              <div className="relative aspect-square bg-[#05080E] overflow-hidden flex items-center justify-center">
                <img
                  src={api.getLayerTileUrl(scene.scene_id, m.id)}
                  alt={m.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1.5 left-1.5 bg-[#070B14]/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-gray-300 backdrop-blur">
                  2.5 m Output
                </div>
              </div>

              {/* Metrics Breakdown */}
              <div className="p-2.5 space-y-1.5 font-mono text-xs flex-1 bg-[#070B14]">
                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  <div className="p-1 bg-[#0A0F1A] rounded">
                    <span className="text-gray-500 text-[8px] block">PSNR</span>
                    <span className={`font-bold ${isGeoSR ? 'text-[#00FF9D]' : 'text-white'}`}>{m.psnr}</span>
                  </div>
                  <div className="p-1 bg-[#0A0F1A] rounded">
                    <span className="text-gray-500 text-[8px] block">SAM</span>
                    <span className="font-bold text-white">{m.sam}</span>
                  </div>
                  <div className="p-1 bg-[#0A0F1A] rounded">
                    <span className="text-gray-500 text-[8px] block">SSIM</span>
                    <span className="font-bold text-white">{m.ssim}</span>
                  </div>
                  <div className="p-1 bg-[#0A0F1A] rounded">
                    <span className="text-gray-500 text-[8px] block">Consistency</span>
                    <span className="font-bold text-[#00F0FF]">{m.consistency}</span>
                  </div>
                </div>
                <p className="text-[9px] text-gray-400 font-sans leading-tight pt-1 border-t border-white/5">
                  {m.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Verified Comparison Table */}
      <div className="bg-[#070B14] rounded-xl border border-white/10 p-4 space-y-3 font-mono">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <div className="flex items-center gap-2 text-white font-bold text-xs">
            <Award className="w-4 h-4 text-[#00FF9D]" />
            <span>VERIFIED EVALUATION MATRIX (30-PATCH HELD-OUT SUBSET)</span>
          </div>
          <span className="text-xs text-gray-400 font-normal">
            SEN2SR / Mamba Architecture Benchmark
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-[11px]">
                <th className="py-2 px-2.5">METHOD</th>
                <th className="py-2 px-2.5">PSNR (dB) ↑</th>
                <th className="py-2 px-2.5">SAM (deg) ↓</th>
                <th className="py-2 px-2.5">SSIM ↑</th>
                <th className="py-2 px-2.5">MAE ↓</th>
                <th className="py-2 px-2.5">CONSISTENCY ↓</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300 text-[11px]">
              <tr className="hover:bg-white/5">
                <td className="py-2 px-2.5 font-semibold text-gray-400">Bicubic Baseline</td>
                <td className="py-2 px-2.5 text-white">36.4025</td>
                <td className="py-2 px-2.5 text-[#00FF9D]">2.3979°</td>
                <td className="py-2 px-2.5 text-white">0.9777</td>
                <td className="py-2 px-2.5 text-white">0.010851</td>
                <td className="py-2 px-2.5 text-[#00F0FF]">0.0009476</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="py-2 px-2.5 font-semibold text-red-400">Mamba Raw (Unconstrained)</td>
                <td className="py-2 px-2.5 text-red-400">21.3384</td>
                <td className="py-2 px-2.5 text-red-400">36.4250°</td>
                <td className="py-2 px-2.5 text-red-400">0.4194</td>
                <td className="py-2 px-2.5 text-red-400">0.083663</td>
                <td className="py-2 px-2.5 text-red-400">0.0820112</td>
              </tr>
              <tr className="hover:bg-white/5">
                <td className="py-2 px-2.5 font-semibold text-gray-300">Mamba + Hard Constraint</td>
                <td className="py-2 px-2.5 text-white">36.1080</td>
                <td className="py-2 px-2.5 text-white">2.4476°</td>
                <td className="py-2 px-2.5 text-white">0.9763</td>
                <td className="py-2 px-2.5 text-white">0.011161</td>
                <td className="py-2 px-2.5 text-[#00F0FF]">0.0008205</td>
              </tr>
              <tr className="bg-[#00F0FF]/10 font-bold border border-[#00F0FF]/40 text-white">
                <td className="py-2 px-2.5 text-[#00F0FF] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF9D]" />
                  <span>GeoSR-NTRO (Ours)</span>
                </td>
                <td className="py-2 px-2.5 text-[#00FF9D]">36.3562 (+0.248)</td>
                <td className="py-2 px-2.5 text-white">2.4483°</td>
                <td className="py-2 px-2.5 text-white">0.9775 (+0.0012)</td>
                <td className="py-2 px-2.5 text-white">0.010851 (-0.0003)</td>
                <td className="py-2 px-2.5 text-[#00F0FF]">0.0013762</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
