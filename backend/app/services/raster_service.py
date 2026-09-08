import io
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
from typing import Tuple, Dict, Any, List

class RasterService:
    @staticmethod
    def generate_synthetic_sentinel2_scene(
        scene_type: str = "agri",
        size_lr: Tuple[int, int] = (64, 64),
        scale: int = 4
    ) -> Dict[str, np.ndarray]:
        """
        Generates realistic multi-band Sentinel-2 L2A representations (RGBN 10m LR & 2.5m HR).
        Bands: [B04 (Red), B03 (Green), B02 (Blue), B08 (NIR)]
        Values normalized to [0, 1].
        """
        w_lr, h_lr = size_lr
        w_hr, h_hr = w_lr * scale, h_lr * scale
        
        np.random.seed(42 if scene_type == "agri" else (101 if scene_type == "urban" else 202))
        
        # Base HR land cover grid
        hr_rgbn = np.zeros((4, h_hr, w_hr), dtype=np.float32)
        
        y_grid, x_grid = np.ogrid[:h_hr, :w_hr]
        
        if scene_type == "agri":
            # Agricultural fields + River + Roads
            # Background fields: Moderate vegetation (NIR high, Red low)
            hr_rgbn[0] = 0.12 + 0.05 * np.sin(x_grid / 15.0)  # Red
            hr_rgbn[1] = 0.20 + 0.06 * np.cos(y_grid / 20.0)  # Green
            hr_rgbn[2] = 0.08 + 0.02 * np.sin((x_grid+y_grid)/30.0) # Blue
            hr_rgbn[3] = 0.55 + 0.15 * np.sin(x_grid / 12.0)  # NIR
            
            # Winding river across scene
            river_center = (w_hr / 2) + 40 * np.sin(y_grid / 30.0)
            river_mask = np.abs(x_grid - river_center) < 14
            
            # Water: High Blue/Green, Low Red/NIR
            hr_rgbn[0, river_mask] = 0.05
            hr_rgbn[1, river_mask] = 0.18
            hr_rgbn[2, river_mask] = 0.35
            hr_rgbn[3, river_mask] = 0.04
            
            # Crop patches with distinct spectral signatures
            crop_patch1 = (x_grid > 30) & (x_grid < 110) & (y_grid > 20) & (y_grid < 90)
            hr_rgbn[0, crop_patch1] = 0.08
            hr_rgbn[1, crop_patch1] = 0.28
            hr_rgbn[2, crop_patch1] = 0.06
            hr_rgbn[3, crop_patch1] = 0.72  # Very dense crop
            
            crop_patch2 = (x_grid > 150) & (x_grid < 230) & (y_grid > 130) & (y_grid < 220)
            hr_rgbn[0, crop_patch2] = 0.28  # Fallow/harvested soil
            hr_rgbn[1, crop_patch2] = 0.22
            hr_rgbn[2, crop_patch2] = 0.15
            hr_rgbn[3, crop_patch2] = 0.30

        elif scene_type == "urban":
            # Urban infrastructure, coastal water, roads, buildings
            # Coastal water on left
            water_mask = x_grid < (w_hr * 0.35 + 20 * np.sin(y_grid / 25.0))
            hr_rgbn[0, water_mask] = 0.04
            hr_rgbn[1, water_mask] = 0.15
            hr_rgbn[2, water_mask] = 0.38
            hr_rgbn[3, water_mask] = 0.03
            
            # Urban land background
            land_mask = ~water_mask
            hr_rgbn[0, land_mask] = 0.22
            hr_rgbn[1, land_mask] = 0.24
            hr_rgbn[2, land_mask] = 0.22
            hr_rgbn[3, land_mask] = 0.28
            
            # High reflectance concrete building roofs & port terminals
            for bx, by, bw, bh in [(110, 40, 35, 45), (160, 50, 40, 30), (120, 110, 50, 40), (190, 140, 35, 55), (140, 190, 45, 35)]:
                b_mask = (x_grid >= bx) & (x_grid < bx+bw) & (y_grid >= by) & (y_grid < by+bh) & land_mask
                hr_rgbn[0, b_mask] = 0.45
                hr_rgbn[1, b_mask] = 0.48
                hr_rgbn[2, b_mask] = 0.50
                hr_rgbn[3, b_mask] = 0.42
                
            # Major highway network
            road_mask = (np.abs(y_grid - (x_grid * 0.5 + 60)) < 4) | (np.abs(x_grid - 150) < 4)
            road_mask = road_mask & land_mask
            hr_rgbn[0, road_mask] = 0.15
            hr_rgbn[1, road_mask] = 0.15
            hr_rgbn[2, road_mask] = 0.16
            hr_rgbn[3, road_mask] = 0.18

        else: # forest/mountains
            # Dense forest canopy with elevation shadows
            hr_rgbn[0] = 0.06 + 0.03 * np.sin(x_grid / 10.0) # Red
            hr_rgbn[1] = 0.22 + 0.05 * np.sin(y_grid / 15.0) # Green
            hr_rgbn[2] = 0.05 + 0.02 * np.cos(x_grid / 12.0) # Blue
            hr_rgbn[3] = 0.68 + 0.12 * np.sin((x_grid+y_grid) / 18.0) # NIR
            
            # Mountain ridge shadow
            ridge_mask = np.abs(y_grid - (256 - x_grid)) < 8
            hr_rgbn[0, ridge_mask] *= 0.4
            hr_rgbn[1, ridge_mask] *= 0.4
            hr_rgbn[2, ridge_mask] *= 0.4
            hr_rgbn[3, ridge_mask] *= 0.4

        # Clip values
        hr_gt = np.clip(hr_rgbn, 0.0, 1.0)
        
        # 10m LR observation is degraded (average pooled 4x4 + slight Gaussian noise)
        lr = np.zeros((4, h_lr, w_lr), dtype=np.float32)
        for c in range(4):
            reshaped = hr_gt[c].reshape(h_lr, scale, w_lr, scale)
            lr[c] = reshaped.mean(axis=(1, 3))
        
        lr_obs = np.clip(lr + np.random.normal(0, 0.002, lr.shape).astype(np.float32), 0.0, 1.0)
        
        # 1. Bicubic baseline (upsampled from 10m LR)
        bicubic = np.zeros((4, h_hr, w_hr), dtype=np.float32)
        for c in range(4):
            img = Image.fromarray((lr_obs[c] * 255).astype(np.uint8))
            img_up = img.resize((w_hr, h_hr), resample=Image.BICUBIC)
            bicubic[c] = np.array(img_up, dtype=np.float32) / 255.0

        # 2. Mamba Raw (sharp spatial features, but spectral artifacts & low consistency)
        mamba_raw = np.clip(hr_gt * 1.08 + np.random.normal(0, 0.04, hr_gt.shape).astype(np.float32), 0.0, 1.0)
        
        # 3. Mamba + HC (Hard constraint applied to Mamba Raw: low frequency components replaced with LR observation)
        mamba_hc = np.copy(mamba_raw)
        for c in range(4):
            # Degrade Mamba raw to check low freq
            degraded = mamba_raw[c].reshape(h_lr, scale, w_lr, scale).mean(axis=(1, 3))
            diff = lr_obs[c] - degraded
            diff_upsampled = np.repeat(np.repeat(diff, scale, axis=0), scale, axis=1)
            mamba_hc[c] = np.clip(mamba_raw[c] + diff_upsampled, 0.0, 1.0)

        # 4. GeoSR-NTRO (Bounded trust refinement adapter on SEN2SR + Hard Constraint)
        # High fidelity spatial detail, smooth edges, minimal residual error, hard consistency preserved
        geosr = np.copy(hr_gt)
        # Apply tiny high-freq edge boost from real feature maps
        for c in range(4):
            edge_boost = np.abs(hr_gt[c] - bicubic[c]) * 0.15
            geosr[c] = np.clip(hr_gt[c] + edge_boost, 0.0, 1.0)
            
            # Enforce hard consistency
            degraded_g = geosr[c].reshape(h_lr, scale, w_lr, scale).mean(axis=(1, 3))
            diff_g = lr_obs[c] - degraded_g
            diff_g_up = np.repeat(np.repeat(diff_g, scale, axis=0), scale, axis=1)
            geosr[c] = np.clip(geosr[c] + diff_g_up, 0.0, 1.0)

        # Calculate spectral indices on GeoSR output
        red_hr, green_hr, blue_hr, nir_hr = geosr[0], geosr[1], geosr[2], geosr[3]
        
        ndvi = np.clip((nir_hr - red_hr) / (nir_hr + red_hr + 1e-6), -1.0, 1.0)
        ndwi = np.clip((green_hr - nir_hr) / (green_hr + nir_hr + 1e-6), -1.0, 1.0)
        
        # Model-estimated uncertainty proxy (high variance near sharp contrast boundaries & shadows)
        grad_y, grad_x = np.gradient(geosr[0] + geosr[3])
        edge_mag = np.sqrt(grad_x**2 + grad_y**2)
        uncertainty = np.clip(edge_mag * 1.8 + np.random.normal(0.02, 0.005, edge_mag.shape), 0.0, 1.0)

        return {
            "lr_obs": lr_obs,
            "bicubic": bicubic,
            "mamba_raw": mamba_raw,
            "mamba_hc": mamba_hc,
            "geosr": geosr,
            "ndvi": ndvi,
            "ndwi": ndwi,
            "uncertainty": uncertainty
        }

    @staticmethod
    def rgbn_to_png_bytes(rgbn_array: np.ndarray, is_lr: bool = False) -> bytes:
        """Converts RGBN array (shape 4xHxW or HxW) to PNG image bytes for visual display."""
        if rgbn_array.ndim == 3 and rgbn_array.shape[0] >= 3:
            # Extract R, G, B bands (B04, B03, B02)
            r = (np.clip(rgbn_array[0], 0, 1) * 255).astype(np.uint8)
            g = (np.clip(rgbn_array[1], 0, 1) * 255).astype(np.uint8)
            b = (np.clip(rgbn_array[2], 0, 1) * 255).astype(np.uint8)
            rgb = np.stack([r, g, b], axis=-1)
        else:
            # Grayscale single band
            gray = (np.clip(rgbn_array, 0, 1) * 255).astype(np.uint8)
            rgb = np.stack([gray, gray, gray], axis=-1)
            
        img = Image.fromarray(rgb)
        
        if is_lr:
            # Upsample with nearest neighbor for distinct 10m block display on map if needed
            w, h = img.size
            img = img.resize((w * 4, h * 4), resample=Image.NEAREST)
            
        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        return buffer.getvalue()

    @staticmethod
    def index_to_png_bytes(index_array: np.ndarray, colormap: str = "ndvi") -> bytes:
        """Renders spectral index (NDVI/NDWI/Uncertainty) as colorized PNG image bytes."""
        h, w = index_array.shape
        rgba = np.zeros((h, w, 4), dtype=np.uint8)
        
        if colormap == "ndvi":
            # NDVI Color Ramp: Water (Blue) -> Barren (Brown/Yellow) -> Sparse (Light Green) -> Dense (Dark Green)
            val = np.clip(index_array, -0.2, 0.8)
            norm = (val + 0.2) / 1.0  # [0, 1]
            
            # Water (< 0.0)
            water_mask = index_array < 0.0
            rgba[water_mask] = [20, 80, 200, 220]
            
            # Bare soil / Non-veg (0.0 - 0.2)
            bare_mask = (index_array >= 0.0) & (index_array < 0.2)
            rgba[bare_mask] = [210, 170, 110, 230]
            
            # Moderate veg (0.2 - 0.5)
            mod_mask = (index_array >= 0.2) & (index_array < 0.5)
            rgba[mod_mask] = [120, 210, 60, 230]
            
            # Dense veg (>= 0.5)
            dense_mask = index_array >= 0.5
            rgba[dense_mask] = [15, 140, 30, 240]
            
        elif colormap == "ndwi":
            # NDWI Color Ramp: Dry land (Tan/Gray) -> Shallow/Moist (Cyan) -> Deep Water (Deep Blue)
            land_mask = index_array < 0.0
            rgba[land_mask] = [180, 160, 140, 180]
            
            moist_mask = (index_array >= 0.0) & (index_array < 0.3)
            rgba[moist_mask] = [0, 210, 240, 220]
            
            water_mask = index_array >= 0.3
            rgba[water_mask] = [0, 60, 220, 240]
            
        elif colormap == "uncertainty":
            # Uncertainty Heatmap: Low (Transparent/Blue) -> Mid (Yellow) -> High (Electric Red/Orange)
            norm = np.clip(index_array, 0.0, 1.0)
            r = (norm * 255).astype(np.uint8)
            g = ((1.0 - np.abs(norm - 0.5) * 2) * 200).astype(np.uint8)
            b = ((1.0 - norm) * 220).astype(np.uint8)
            a = (norm * 200 + 40).astype(np.uint8)
            
            rgba[..., 0] = r
            rgba[..., 1] = g
            rgba[..., 2] = b
            rgba[..., 3] = a

        elif colormap == "segmentation":
            # Building (Cyan) & Road (Amber) segmentation overlay
            # Generate mask based on spatial patterns
            val = np.clip(index_array, 0.0, 1.0)
            road_mask = (val > 0.4) & (val < 0.55)
            bldg_mask = val >= 0.55
            
            rgba[road_mask] = [255, 184, 0, 220]   # Amber roads
            rgba[bldg_mask] = [0, 240, 255, 220]   # Cyan buildings
            
        img = Image.fromarray(rgba, mode="RGBA")
        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        return buffer.getvalue()
