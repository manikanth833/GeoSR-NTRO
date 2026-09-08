from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class HealthResponse(BaseModel):
    status: str
    demo_mode: bool
    version: str
    timestamp: str

class SystemConfigResponse(BaseModel):
    project_name: str
    demo_mode: bool
    backbone: str
    trust_layer: str
    trainable_params: int
    hard_constraint: str
    resolution_in_m: float
    resolution_out_m: float
    scale_factor: int

class AOIRequest(BaseModel):
    min_lat: float = Field(..., example=28.6139)
    min_lon: float = Field(..., example=77.2090)
    max_lat: float = Field(..., example=28.6439)
    max_lon: float = Field(..., example=77.2390)
    name: Optional[str] = "Custom AOI"

class InferenceRequest(BaseModel):
    scene_id: str = Field(..., example="demo_scene_01")
    aoi: Optional[AOIRequest] = None
    enable_hard_constraint: bool = True
    enable_uncertainty: bool = True
    enable_spectral_indices: bool = True

class MethodMetrics(BaseModel):
    PSNR: float
    SAM: float
    SSIM: float
    MAE: float
    Consistency: float

class ValidationMetrics(BaseModel):
    evaluation_scope: str
    total_patches: Optional[int] = 30
    methods: Dict[str, MethodMetrics]
    delta_vs_mamba_hc: Dict[str, float]


class SceneMetadata(BaseModel):
    scene_id: str
    name: str
    location: str
    coordinates: List[float]  # [lat, lon]
    bbox: List[float]         # [min_lon, min_lat, max_lon, max_lat]
    sensor: str = "Sentinel-2 L2A"
    bands: List[str] = ["B04 (R)", "B03 (G)", "B02 (B)", "B08 (NIR)"]
    input_resolution: str = "10 m"
    output_resolution: str = "2.5 m"
    scale_factor: str = "4×"
    acquisition_date: str
    cloud_cover_percentage: float
    description: str

class InferenceResponse(BaseModel):
    job_id: str
    scene_id: str
    demo_mode: bool
    status: str
    execution_time_seconds: float
    metadata: SceneMetadata
    metrics: ValidationMetrics
    available_layers: List[str]
    telemetry_logs: List[str]

class PixelInspectionRequest(BaseModel):
    scene_id: str
    lat: float
    lon: float

class PixelInspectionResponse(BaseModel):
    scene_id: str
    lat: float
    lon: float
    reflectance_10m: Dict[str, float]
    reflectance_2_5m: Dict[str, float]
    ndvi: float
    ndwi: float
    uncertainty_proxy: float
    vegetation_class: str
    water_class: str
    downstream_feature: str
