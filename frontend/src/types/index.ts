export interface SceneMetadata {
  scene_id: string;
  name: string;
  location: string;
  coordinates: [number, number]; // [lat, lon]
  bbox: [number, number, number, number]; // [min_lon, min_lat, max_lon, max_lat]
  sensor: string;
  bands: string[];
  input_resolution: string;
  output_resolution: string;
  scale_factor: string;
  acquisition_date: string;
  cloud_cover_percentage: number;
  description: string;
}

export interface MethodMetrics {
  PSNR: number;
  SAM: number;
  SSIM: number;
  MAE: number;
  Consistency: number;
}

export interface ValidationMetrics {
  evaluation_scope: string;
  total_patches: number;
  methods: Record<string, MethodMetrics>;
  delta_vs_mamba_hc: Record<string, number>;
}

export interface SystemConfig {
  project_name: string;
  demo_mode: boolean;
  backbone: string;
  trust_layer: string;
  trainable_params: number;
  hard_constraint: string;
  resolution_in_m: number;
  resolution_out_m: number;
  scale_factor: number;
}

export interface InferenceResponse {
  job_id: string;
  scene_id: string;
  demo_mode: boolean;
  status: string;
  execution_time_seconds: number;
  metadata: SceneMetadata;
  metrics: ValidationMetrics;
  available_layers: string[];
  telemetry_logs: string[];
}

export interface PixelInspectionResponse {
  scene_id: string;
  lat: number;
  lon: number;
  reflectance_10m: Record<string, number>;
  reflectance_2_5m: Record<string, number>;
  ndvi: number;
  ndwi: number;
  uncertainty_proxy: number;
  vegetation_class: string;
  water_class: string;
  downstream_feature: string;
}

export type ActiveTab = 'OVERVIEW' | 'MISSION' | 'MODEL_LAB' | 'ANALYTICS' | 'ABOUT';
