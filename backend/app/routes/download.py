import io
import json
import numpy as np
from PIL import Image
from fastapi import APIRouter, HTTPException, Response
from app.services.demo_service import demo_service
from app.services.raster_service import RasterService

router = APIRouter()

@router.get("/download/{scene_id}/{file_type}")
def download_export(scene_id: str, file_type: str):
    meta = demo_service.get_scene_metadata(scene_id)
    if not meta:
        raise HTTPException(status_code=404, detail="Scene not found")
        
    scene_data = demo_service.get_scene_data(scene_id)
    
    if file_type in ["geotiff", "sr_2_5m"]:
        # Generate 4-band 2.5m TIFF byte stream with spatial metadata header text
        geosr_array = scene_data["geosr"]
        rgb = (np.clip(geosr_array[:3], 0, 1) * 255).astype(np.uint8)
        img = Image.fromarray(np.transpose(rgb, (1, 2, 0)))
        
        buffer = io.BytesIO()
        img.save(buffer, format="TIFF")
        content = buffer.getvalue()
        
        filename = f"{scene_id}_2_5m_GeoSR.tif"
        return Response(
            content=content,
            media_type="image/tiff",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
        
    elif file_type == "uncertainty":
        unc_array = scene_data["uncertainty"]
        png_bytes = RasterService.index_to_png_bytes(unc_array, colormap="uncertainty")
        filename = f"{scene_id}_confidence_uncertainty.png"
        return Response(
            content=png_bytes,
            media_type="image/png",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
        
    elif file_type == "metadata":
        payload = {
            "project": "GeoSR-NTRO",
            "problem_statement": "SIH 2026 PS 26142 (NTRO - Space Technology)",
            "scene_metadata": meta.dict(),
            "validation_reference": demo_service.validation_metrics.dict(),
            "philosophy": "We don't hallucinate a sharper satellite image. We generate a higher-resolution representation constrained by what the satellite actually observed."
        }
        json_str = json.dumps(payload, indent=2)
        filename = f"{scene_id}_metadata.json"
        return Response(
            content=json_str.encode("utf-8"),
            media_type="application/json",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
        
    else:
        raise HTTPException(status_code=400, detail="Invalid file type requested")
