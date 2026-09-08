import math
from typing import Tuple, List

def latlon_to_tile(lat: float, lon: float, zoom: int) -> Tuple[int, int]:
    """Convert Lat/Lon to Web Mercator tile X, Y coordinates."""
    lat_rad = math.radians(lat)
    n = 2.0 ** zoom
    xtile = int((lon + 180.0) / 360.0 * n)
    ytile = int((1.0 - math.asinh(math.tan(lat_rad)) / math.pi) / 2.0 * n)
    return xtile, ytile

def tile_to_bbox(x: int, y: int, z: int) -> List[float]:
    """Convert Web Mercator tile X, Y, Z to bounding box [min_lon, min_lat, max_lon, max_lat]."""
    n = 2.0 ** z
    lon1 = x / n * 360.0 - 180.0
    lat1_rad = math.atan(math.sinh(math.pi * (1.0 - 2.0 * y / n)))
    lat1 = math.degrees(lat1_rad)
    
    lon2 = (x + 1) / n * 360.0 - 180.0
    lat2_rad = math.atan(math.sinh(math.pi * (1.0 - 2.0 * (y + 1) / n)))
    lat2 = math.degrees(lat2_rad)
    
    return [lon1, min(lat1, lat2), lon2, max(lat1, lat2)]

def calculate_ndvi(red: float, nir: float) -> float:
    """Calculate Normalized Difference Vegetation Index."""
    denom = nir + red
    if abs(denom) < 1e-6:
        return 0.0
    return float(np_clip((nir - red) / denom, -1.0, 1.0))

def calculate_ndwi(green: float, nir: float) -> float:
    """Calculate Normalized Difference Water Index."""
    denom = green + nir
    if abs(denom) < 1e-6:
        return 0.0
    return float(np_clip((green - nir) / denom, -1.0, 1.0))

def np_clip(val: float, min_val: float, max_val: float) -> float:
    return max(min_val, min(max_val, val))
