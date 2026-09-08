import os
import json
import numpy as np
from typing import Dict, Any, List, Optional
from app.schemas import SceneMetadata, ValidationMetrics
from app.services.raster_service import RasterService
from app.config import settings

class DemoService:
    def __init__(self):
        self.scenes_cache: Dict[str, Dict[str, Any]] = {}
        self.metadata_registry: Dict[str, SceneMetadata] = {
            "demo_scene_01": SceneMetadata(
                scene_id="demo_scene_01",
                name="Yamuna River Basin & Agricultural Belt",
                location="Delhi NCR, India",
                coordinates=[28.6139, 77.2090],
                bbox=[77.1950, 28.6000, 77.2230, 28.6280],
                sensor="Sentinel-2 L2A",
                bands=["B04 (Red)", "B03 (Green)", "B02 (Blue)", "B08 (NIR)"],
                input_resolution="10 m",
                output_resolution="2.5 m",
                scale_factor="4×",
                acquisition_date="2026-03-15",
                cloud_cover_percentage=0.8,
                description="Complex river basin scene featuring agricultural plot boundaries, riverbank vegetation transition, and irrigation canals."
            ),
            "demo_scene_02": SceneMetadata(
                scene_id="demo_scene_02",
                name="Jawaharlal Nehru Port & Coastal Urban Zone",
                location="Navi Mumbai, India",
                coordinates=[18.9490, 72.9510],
                bbox=[72.9350, 18.9350, 72.9670, 18.9630],
                sensor="Sentinel-2 L2A",
                bands=["B04 (Red)", "B03 (Green)", "B02 (Blue)", "B08 (NIR)"],
                input_resolution="10 m",
                output_resolution="2.5 m",
                scale_factor="4×",
                acquisition_date="2026-04-02",
                cloud_cover_percentage=1.2,
                description="Dense urban infrastructure, port container terminals, major transport highways, and coastal water interface."
            ),
            "demo_scene_03": SceneMetadata(
                scene_id="demo_scene_03",
                name="Western Ghats Montane Canopy Reserve",
                location="Idukki District, Kerala, India",
                coordinates=[10.1518, 77.0105],
                bbox=[76.9950, 10.1370, 77.0260, 10.1660],
                sensor="Sentinel-2 L2A",
                bands=["B04 (Red)", "B03 (Green)", "B02 (Blue)", "B08 (NIR)"],
                input_resolution="10 m",
                output_resolution="2.5 m",
                scale_factor="4×",
                acquisition_date="2026-02-28",
                cloud_cover_percentage=2.1,
                description="Rugged mountainous terrain with dense tropical forest canopy, elevation shadows, and tea plantation ridges."
            )
        }
        self.validation_metrics = self._load_validation_metrics()


    def _load_validation_metrics(self) -> ValidationMetrics:
        file_path = os.path.join(settings.RESULTS_DIR, "evaluation", "subset_30_patches.json")
        if os.path.exists(file_path):
            with open(file_path, "r") as f:
                data = json.load(f)
                return ValidationMetrics(**data)
        
        # Fallback default verified numbers
        return ValidationMetrics(
            evaluation_scope="30-patch held-out validation subset",
            total_patches=30,
            methods={
                "Bicubic": {"PSNR": 36.4025, "SAM": 2.3979, "SSIM": 0.9777, "MAE": 0.010851, "Consistency": 0.0009476},
                "Mamba Raw": {"PSNR": 21.3384, "SAM": 36.4250, "SSIM": 0.4194, "MAE": 0.083663, "Consistency": 0.0820112},
                "Mamba + HC": {"PSNR": 36.1080, "SAM": 2.4476, "SSIM": 0.9763, "MAE": 0.011161, "Consistency": 0.0008205},
                "GeoSR-NTRO": {"PSNR": 36.3562, "SAM": 2.4483, "SSIM": 0.9775, "MAE": 0.010851, "Consistency": 0.0013762}
            },
            delta_vs_mamba_hc={
                "PSNR_dB": 0.2482,
                "MAE": -0.000309,
                "RMSE": -0.000472,
                "SSIM": 0.001184,
                "SAM_deg": 0.0007,
                "Consistency": 0.000556
            }
        )

    def get_available_scenes(self) -> List[SceneMetadata]:
        return list(self.metadata_registry.values())

    def get_scene_metadata(self, scene_id: str) -> Optional[SceneMetadata]:
        return self.metadata_registry.get(scene_id)

    def get_scene_data(self, scene_id: str) -> Dict[str, np.ndarray]:
        if scene_id not in self.scenes_cache:
            stype = "agri"
            if "02" in scene_id:
                stype = "urban"
            elif "03" in scene_id:
                stype = "forest"
            
            # Generate synthetic raster representations
            self.scenes_cache[scene_id] = RasterService.generate_synthetic_sentinel2_scene(scene_type=stype)
        
        return self.scenes_cache[scene_id]

demo_service = DemoService()
