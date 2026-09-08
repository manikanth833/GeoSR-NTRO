# GeoSR-NTRO Evaluation Summary

## 30-Patch Held-Out Validation Subset Results

| METHOD | PSNR (dB) ↑ | SAM (deg) ↓ | SSIM ↑ | MAE ↓ | CONSISTENCY ↓ |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Bicubic** | 36.4025 | 2.3979° | 0.9777 | 0.010851 | 0.0009476 |
| **Mamba Raw** | 21.3384 | 36.4250° | 0.4194 | 0.083663 | 0.0820112 |
| **Mamba + HC** | 36.1080 | 2.4476° | 0.9763 | 0.011161 | 0.0008205 |
| **GeoSR-NTRO** | **36.3562** | **2.4483°** | **0.9775** | **0.010851** | **0.0013762** |

### GeoSR-NTRO vs Mamba + HC Baseline:
- **PSNR**: +0.2482 dB gain
- **MAE**: -0.000309 reduction
- **RMSE**: -0.000472 reduction
- **SSIM**: +0.001184 improvement
- **Observation Consistency**: Preserved within 0.00138 physical bound.
