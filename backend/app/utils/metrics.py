import numpy as np

def calculate_psnr(img1: np.ndarray, img2: np.ndarray, max_val: float = 1.0) -> float:
    """Calculate Peak Signal-to-Noise Ratio (PSNR)."""
    mse = np.mean((img1 - img2) ** 2)
    if mse == 0:
        return float('inf')
    return float(10 * np.log10((max_val ** 2) / mse))

def calculate_mae(img1: np.ndarray, img2: np.ndarray) -> float:
    """Calculate Mean Absolute Error (MAE)."""
    return float(np.mean(np.abs(img1 - img2)))

def calculate_rmse(img1: np.ndarray, img2: np.ndarray) -> float:
    """Calculate Root Mean Square Error (RMSE)."""
    return float(np.sqrt(np.mean((img1 - img2) ** 2)))

def calculate_sam(img1: np.ndarray, img2: np.ndarray) -> float:
    """
    Calculate Spectral Angle Mapper (SAM) in degrees.
    Inputs are assumed to be (C, H, W) or (H, W, C).
    """
    if img1.ndim == 3 and img1.shape[0] in [3, 4]:
        # Convert (C, H, W) to (H, W, C)
        img1 = np.transpose(img1, (1, 2, 0))
        img2 = np.transpose(img2, (1, 2, 0))
        
    dot_product = np.sum(img1 * img2, axis=-1)
    norm_1 = np.linalg.norm(img1, axis=-1)
    norm_2 = np.linalg.norm(img2, axis=-1)
    
    denominator = norm_1 * norm_2
    denominator[denominator == 0] = 1e-8
    
    cos_angle = np.clip(dot_product / denominator, -1.0, 1.0)
    angle_rad = np.arccos(cos_angle)
    angle_deg = np.degrees(angle_rad)
    return float(np.mean(angle_deg))

def calculate_consistency(sr: np.ndarray, lr: np.ndarray, scale_factor: int = 4) -> float:
    """
    Calculate Low-Frequency Observation Consistency.
    Degrades SR output via average pooling (or bicubic downsampling) to original LR resolution
    and computes MAE relative to original LR observation.
    """
    if sr.ndim == 3 and sr.shape[0] in [3, 4]:
        # (C, H, W)
        c, h, w = sr.shape
        lr_h, lr_w = h // scale_factor, w // scale_factor
        degraded = np.zeros((c, lr_h, lr_w), dtype=sr.dtype)
        for i in range(c):
            # Reshape for average pooling
            reshaped = sr[i, :lr_h*scale_factor, :lr_w*scale_factor].reshape(lr_h, scale_factor, lr_w, scale_factor)
            degraded[i] = reshaped.mean(axis=(1, 3))
        return float(np.mean(np.abs(degraded - lr[:, :lr_h, :lr_w])))
    else:
        h, w = sr.shape
        lr_h, lr_w = h // scale_factor, w // scale_factor
        reshaped = sr[:lr_h*scale_factor, :lr_w*scale_factor].reshape(lr_h, scale_factor, lr_w, scale_factor)
        degraded = reshaped.mean(axis=(1, 3))
        return float(np.mean(np.abs(degraded - lr[:lr_h, :lr_w])))
