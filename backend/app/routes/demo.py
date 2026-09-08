from fastapi import APIRouter, HTTPException, Response, Query
from typing import List
from app.schemas import SceneMetadata
from app.services.demo_service import demo_service
from app.services.raster_service import RasterService

router = APIRouter()

@router.get("/demo/scenes", response_model=List[SceneMetadata])
def get_demo_scenes():
    return demo_service.get_available_scenes()

@router.get("/demo/scene/{scene_id}", response_model=SceneMetadata)
def get_scene_metadata(scene_id: str):
    meta = demo_service.get_scene_metadata(scene_id)
    if not meta:
        raise HTTPException(status_code=404, detail="Scene not found")
    return meta

@router.get("/tiles/{scene_id}/{layer}")
def get_layer_image(scene_id: str, layer: str):
    """
    Renders layer image as PNG bytes for map/layer viewing.
    Supported layers: 10m, geosr, bicubic, mamba_raw, mamba_hc, ndvi, ndwi, uncertainty, segmentation.
    """
    scene_data = demo_service.get_scene_data(scene_id)
    
    if layer == "10m":
        png_bytes = RasterService.rgbn_to_png_bytes(scene_data["lr_obs"], is_lr=True)
    elif layer in ["geosr", "2.5m"]:
        png_bytes = RasterService.rgbn_to_png_bytes(scene_data["geosr"])
    elif layer == "bicubic":
        png_bytes = RasterService.rgbn_to_png_bytes(scene_data["bicubic"])
    elif layer == "mamba_raw":
        png_bytes = RasterService.rgbn_to_png_bytes(scene_data["mamba_raw"])
    elif layer == "mamba_hc":
        png_bytes = RasterService.rgbn_to_png_bytes(scene_data["mamba_hc"])
    elif layer == "ndvi":
        png_bytes = RasterService.index_to_png_bytes(scene_data["ndvi"], colormap="ndvi")
    elif layer == "ndwi":
        png_bytes = RasterService.index_to_png_bytes(scene_data["ndwi"], colormap="ndwi")
    elif layer in ["uncertainty", "confidence"]:
        png_bytes = RasterService.index_to_png_bytes(scene_data["uncertainty"], colormap="uncertainty")
    elif layer == "segmentation":
        png_bytes = RasterService.index_to_png_bytes(scene_data["geosr"][0], colormap="segmentation")
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported layer: {layer}")
        
    return Response(content=png_bytes, media_type="image/png")
