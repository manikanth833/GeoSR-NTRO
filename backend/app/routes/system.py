import datetime
from fastapi import APIRouter
from app.config import settings
from app.schemas import HealthResponse, SystemConfigResponse

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(
        status="ONLINE",
        demo_mode=settings.DEMO_MODE,
        version=settings.VERSION,
        timestamp=datetime.datetime.utcnow().isoformat() + "Z"
    )

@router.get("/config", response_model=SystemConfigResponse)
def get_system_config():
    return SystemConfigResponse(
        project_name=settings.PROJECT_NAME,
        demo_mode=settings.DEMO_MODE,
        backbone="SEN2SR / Mamba",
        trust_layer="Bounded Refinement Adapter (~11.5k params)",
        trainable_params=11588,
        hard_constraint="Official SEN2SR HardConstraint",
        resolution_in_m=10.0,
        resolution_out_m=2.5,
        scale_factor=4
    )
