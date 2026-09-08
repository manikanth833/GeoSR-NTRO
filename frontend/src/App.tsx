import React, { useEffect, useState } from 'react';
import { ActiveTab, SceneMetadata, ValidationMetrics } from './types';
import { TopBar } from './components/TopBar';
import { Dashboard } from './pages/Dashboard';
import { ModelLab } from './pages/ModelLab';
import { AnalyticsView } from './pages/AnalyticsView';
import { AboutScience } from './pages/AboutScience';
import { api } from './services/api';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('OVERVIEW');
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [scenes, setScenes] = useState<SceneMetadata[]>([]);
  const [selectedScene, setSelectedScene] = useState<SceneMetadata | null>(null);
  const [metrics, setMetrics] = useState<ValidationMetrics | null>(null);
  const [mouseCoords, setMouseCoords] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    async function initApp() {
      try {
        const config = await api.getConfig();
        setDemoMode(config.demo_mode);

        const availableScenes = await api.getDemoScenes();
        setScenes(availableScenes);

        if (availableScenes.length > 0) {
          setSelectedScene(availableScenes[0]);
          const m = await api.getMetrics(availableScenes[0].scene_id);
          setMetrics(m);
        }
      } catch (err) {
        console.error("Failed to connect to GeoSR backend:", err);
      }
    }
    initApp();
  }, []);

  if (!selectedScene) {
    return (
      <div className="h-screen w-screen bg-[#05080E] text-[#00F0FF] font-mono flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#00F0FF] border-t-transparent animate-spin" />
        <p className="text-xs tracking-wider">INITIALIZING GEOSR-NTRO COMMAND CENTER...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-[#05080E] text-[#E2E8F0] overflow-hidden select-none">
      {/* Top Header Navigation */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        demoMode={demoMode}
        mouseCoords={mouseCoords}
      />

      {/* Main View Router */}
      {activeTab === 'OVERVIEW' && (
        <Dashboard
          scenes={scenes}
          selectedScene={selectedScene}
          setSelectedScene={setSelectedScene}
          metrics={metrics}
        />
      )}

      {activeTab === 'MISSION' && (
        <Dashboard
          scenes={scenes}
          selectedScene={selectedScene}
          setSelectedScene={setSelectedScene}
          metrics={metrics}
        />
      )}

      {activeTab === 'MODEL_LAB' && (
        <ModelLab scene={selectedScene} metrics={metrics} />
      )}

      {activeTab === 'ANALYTICS' && (
        <AnalyticsView scene={selectedScene} />
      )}

      {activeTab === 'ABOUT' && (
        <AboutScience />
      )}
    </div>
  );
};

export default App;
