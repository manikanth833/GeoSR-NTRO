import React, { useState } from 'react';
import { SceneMetadata, ValidationMetrics, InferenceResponse, PixelInspectionResponse } from '../types';
import { MissionControl } from '../components/MissionControl';
import { MapView } from '../components/MapView';
import { IntelligencePanel } from '../components/IntelligencePanel';
import { ProcessingOverlay } from '../components/ProcessingOverlay';
import { api } from '../services/api';

interface DashboardProps {
  scenes: SceneMetadata[];
  selectedScene: SceneMetadata;
  setSelectedScene: (scene: SceneMetadata) => void;
  metrics: ValidationMetrics | null;
}

export const Dashboard: React.FC<DashboardProps> = ({
  scenes,
  selectedScene,
  setSelectedScene,
  metrics
}) => {
  const [activeLayers, setActiveLayers] = useState({
    obs10m: true,
    geosr25m: true,
    confidence: false,
    ndvi: false,
    ndwi: false,
    segmentation: false,
  });

  const [mouseCoords, setMouseCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [inspectedPixel, setInspectedPixel] = useState<PixelInspectionResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [inferenceResult, setInferenceResult] = useState<InferenceResponse | null>(null);

  const handleRunInference = async () => {
    setIsProcessing(true);
    try {
      const res = await api.runInference(selectedScene.scene_id);
      setInferenceResult(res);
    } catch (e) {
      console.error('Inference error', e);
    }
  };

  const handleSelectPixel = async (lat: number, lon: number) => {
    try {
      const pxData = await api.inspectPixel(selectedScene.scene_id, lat, lon);
      setInspectedPixel(pxData);
    } catch (e) {
      console.error('Pixel inspect error', e);
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden relative">
      {/* Left Mission Control Panel */}
      <MissionControl
        scenes={scenes}
        selectedScene={selectedScene}
        setSelectedScene={setSelectedScene}
        activeLayers={activeLayers}
        setActiveLayers={setActiveLayers}
        onRunInference={handleRunInference}
        isProcessing={isProcessing}
      />

      {/* Center OpenLayers Map Canvas */}
      <main className="flex-1 relative h-full">
        <MapView
          scene={selectedScene}
          activeLayers={activeLayers}
          onHoverCoords={setMouseCoords}
          onSelectPixel={handleSelectPixel}
        />
      </main>

      {/* Right Intelligence Console Panel */}
      <IntelligencePanel
        scene={selectedScene}
        metrics={metrics}
        inspectedPixel={inspectedPixel}
        activeLayers={activeLayers}
      />

      {/* Processing Telemetry Modal Overlay during Run Super-Resolution */}
      {isProcessing && (
        <ProcessingOverlay
          result={inferenceResult}
          onComplete={() => setIsProcessing(false)}
        />
      )}
    </div>
  );
};
