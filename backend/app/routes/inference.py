from fastapi import APIRouter, HTTPException
from app.schemas import InferenceRequest, InferenceResponse, ValidationMetrics, AOIRequest
from app.services.inference_service import inference_service
from app.services.demo_service import demo_service

router = APIRouter()

@router.post("/aoi")
def submit_aoi(request: AOIRequest):
    return {
        "status": "AOI_ACCEPTED",
        "name": request.name,
        "bounds": [request.min_lon, request.min_lat, request.max_lon, request.max_lat],
        "estimated_pixels_10m": "256x256",
        "estimated_pixels_2_5m": "1024x1024",
        "matched_demo_scene": "demo_scene_01"
    }

@router.post("/inference", response_model=InferenceResponse)
def execute_inference(request: InferenceRequest):
    return inference_service.run_inference(request)

@router.get("/metrics/{scene_id}", response_model=ValidationMetrics)
def get_metrics(scene_id: str):
    return demo_service.validation_metrics
