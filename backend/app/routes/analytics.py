import numpy as np
from fastapi import APIRouter, HTTPException
from app.schemas import PixelInspectionRequest, PixelInspectionResponse
from app.services.demo_service import demo_service

router = APIRouter()

@router.post("/analytics/inspect", response_model=PixelInspectionResponse)
def inspect_pixel(request: PixelInspectionRequest):
    scene_id = request.scene_id if request.scene_id in ["demo_scene_01", "demo_scene_02", "demo_scene_03"] else "demo_scene_01"
    scene_data = demo_service.get_scene_data(scene_id)
    
    # Map lat/lon request to raster matrix pixel (256x256 HR)
    meta = demo_service.get_scene_metadata(scene_id)
    bbox = meta.bbox
    min_lon, min_lat, max_lon, max_lat = bbox
    
    norm_x = np.clip((request.lon - min_lon) / (max_lon - min_lon + 1e-6), 0.0, 1.0)
    norm_y = np.clip((max_lat - request.lat) / (max_lat - min_lat + 1e-6), 0.0, 1.0)
    
    h_hr, w_hr = scene_data["geosr"].shape[1:]
    h_lr, w_lr = scene_data["lr_obs"].shape[1:]
    
    px_hr = int(norm_x * (w_hr - 1))
    py_hr = int(norm_y * (h_hr - 1))
    
    px_lr = int(norm_x * (w_lr - 1))
    py_lr = int(norm_y * (h_lr - 1))
    
    # Extract values
    r_lr = float(scene_data["lr_obs"][0, py_lr, px_lr])
    g_lr = float(scene_data["lr_obs"][1, py_lr, px_lr])
    b_lr = float(scene_data["lr_obs"][2, py_lr, px_lr])
    nir_lr = float(scene_data["lr_obs"][3, py_lr, px_lr])
    
    r_hr = float(scene_data["geosr"][0, py_hr, px_hr])
    g_hr = float(scene_data["geosr"][1, py_hr, px_hr])
    b_hr = float(scene_data["geosr"][2, py_hr, px_hr])
    nir_hr = float(scene_data["geosr"][3, py_hr, px_hr])
    
    ndvi_val = float(scene_data["ndvi"][py_hr, px_hr])
    ndwi_val = float(scene_data["ndwi"][py_hr, px_hr])
    unc_val = float(scene_data["uncertainty"][py_hr, px_hr])
    
    # Classifications
    if ndvi_val < 0.0:
        veg_class = "Water / Non-vegetated"
    elif ndvi_val < 0.2:
        veg_class = "Bare Soil / Low Vegetation"
    elif ndvi_val < 0.5:
        veg_class = "Moderate Crops / Grassland"
    else:
        veg_class = "Dense Canopy Vegetation"
        
    if ndwi_val < 0.0:
        water_class = "Dry Land Surface"
    elif ndwi_val < 0.25:
        water_class = "Moist Soil / Wetland"
    else:
        water_class = "Open Water Body"
        
    downstream_feat = "Building Structure" if r_hr > 0.4 and g_hr > 0.4 else ("Highway Road" if abs(r_hr-b_hr) < 0.03 and r_hr < 0.25 else "Vegetated Land")

    return PixelInspectionResponse(
        scene_id=scene_id,
        lat=request.lat,
        lon=request.lon,
        reflectance_10m={"B04_Red": round(r_lr, 4), "B03_Green": round(g_lr, 4), "B02_Blue": round(b_lr, 4), "B08_NIR": round(nir_lr, 4)},
        reflectance_2_5m={"B04_Red": round(r_hr, 4), "B03_Green": round(g_hr, 4), "B02_Blue": round(b_hr, 4), "B08_NIR": round(nir_hr, 4)},
        ndvi=round(ndvi_val, 4),
        ndwi=round(ndwi_val, 4),
        uncertainty_proxy=round(unc_val, 4),
        vegetation_class=veg_class,
        water_class=water_class,
        downstream_feature=downstream_feat
    )
