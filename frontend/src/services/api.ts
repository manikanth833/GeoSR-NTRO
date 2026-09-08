import { SceneMetadata, ValidationMetrics, SystemConfig, InferenceResponse, PixelInspectionResponse } from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const api = {
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  async getConfig(): Promise<SystemConfig> {
    const res = await fetch(`${API_BASE}/config`);
    return res.json();
  },

  async getDemoScenes(): Promise<SceneMetadata[]> {
    const res = await fetch(`${API_BASE}/demo/scenes`);
    return res.json();
  },

  async getSceneMetadata(sceneId: string): Promise<SceneMetadata> {
    const res = await fetch(`${API_BASE}/demo/scene/${sceneId}`);
    return res.json();
  },

  async getMetrics(sceneId: string): Promise<ValidationMetrics> {
    const res = await fetch(`${API_BASE}/metrics/${sceneId}`);
    return res.json();
  },

  async runInference(sceneId: string): Promise<InferenceResponse> {
    const res = await fetch(`${API_BASE}/inference`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scene_id: sceneId, enable_hard_constraint: true }),
    });
    return res.json();
  },

  async inspectPixel(sceneId: string, lat: number, lon: number): Promise<PixelInspectionResponse> {
    const res = await fetch(`${API_BASE}/analytics/inspect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scene_id: sceneId, lat, lon }),
    });
    return res.json();
  },

  getLayerTileUrl(sceneId: string, layer: string): string {
    return `${API_BASE}/tiles/${sceneId}/${layer}`;
  },

  getDownloadUrl(sceneId: string, fileType: string): string {
    return `${API_BASE}/download/${sceneId}/${fileType}`;
  }
};
