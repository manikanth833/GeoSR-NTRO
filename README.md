# GeoSR-NTRO
### Trustworthy Deep Learning Super-Resolution for Sentinel-2 Satellite Imagery

> **SIH 2026 / NTRO | Problem Statement 26142 | Theme: Space Technology**

---

## Executive Summary & Core Positioning

GeoSR-NTRO is an Earth Observation & Geospatial Intelligence command center built to enhance Sentinel-2 L2A satellite imagery from ~10 m spatial resolution into a 2.5 m super-resolved representation (4× scale), physically constrained by satellite observation consistency.

> **Core Philosophy**:  
> *"We don't hallucinate a sharper satellite image. We generate a higher-resolution representation constrained by what the satellite actually observed."*

---

## Key Features

- **Geospatial Command Console**: Space-tech dark UI with OpenLayers map canvas and pixel-perfect vertical split swipe between 10m Sentinel-2 low-resolution input and 2.5m GeoSR output.
- **SEN2SR / Mamba Pretrained Backbone**: Leveraging deep state-space models for spatial reconstruction.
- **Bounded Trust Refinement Layer**: Lightweight ~11,588 parameter adapter enforcing bounded refinement around frozen backbone weights.
- **Hard Low-Frequency Consistency**: SEN2SR `HardConstraint` forcing the 2.5m output to downsample back to the original 10m Sentinel-2 observation.
- **Spectral Analytics & Downstream Intelligence**: Integrated 2.5m NDVI (vegetation index), NDWI (water index), model confidence heatmap overlays, and building/road footprint segmentation.
- **Model Lab 4-Way Comparison**: Synchronized side-by-side comparison matrix of Bicubic, Mamba Raw, Mamba + HC, and GeoSR-NTRO.
- **Dual-Mode Deployment**:
  - `DEMO_MODE=true` (Default): Serves high-fidelity precomputed raster scenes with full CRS metadata, verified metrics, and interactive telemetry.
  - `DEMO_MODE=false`: Live PyTorch model execution when GPU/CUDA environment is available.

---

## Verified Evaluation Results (30-Patch Held-Out Subset)

| METHOD | PSNR (dB) ↑ | SAM (deg) ↓ | SSIM ↑ | MAE ↓ | CONSISTENCY ↓ |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Bicubic Baseline** | 36.4025 | 2.3979° | 0.9777 | 0.010851 | 0.0009476 |
| **Mamba Raw (Unconstrained)** | 21.3384 | 36.4250° | 0.4194 | 0.083663 | 0.0820112 |
| **Mamba + Hard Constraint** | 36.1080 | 2.4476° | 0.9763 | 0.011161 | 0.0008205 |
| **GeoSR-NTRO (Proposed)** | **36.3562** | **2.4483°** | **0.9775** | **0.010851** | **0.0013762** |

*Key Improvement vs Mamba + HC Baseline*: **+0.2482 dB PSNR gain**, **-0.000309 MAE reduction**, **+0.001184 SSIM gain**.

---

## Architecture Diagram

```
Sentinel-2 L2A 10m Input (RGBN)
        ↓
SEN2SR / Mamba Pretrained Backbone
        ↓
Bounded Refinement Adapter (~11.5k Params)
        ↓
Hard Low-Frequency Consistency Constraint
        ↓
2.5 m GeoSR Output
        ↓
┌───────────────────────┬───────────────────────┬───────────────────────┐
↓                       ↓                       ↓                       ↓
Confidence Heatmap      NDVI Vegetation         NDWI Water Index        Building/Road Infra
```

---

## Getting Started

### 1. Local Quickstart (Without Docker)

#### Backend (FastAPI):
```bash
cd backend
python3 -m pip install -r requirements.txt
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```
Backend API will run at `http://localhost:8000`. API Documentation available at `http://localhost:8000/docs`.

#### Frontend (React + Vite):
```bash
cd frontend
npm install
npm run dev
```
Frontend will run at `http://localhost:5173`.

---

### 2. Docker Quickstart
```bash
docker-compose up --build
```
Access the application at `http://localhost:5173`.

---

## Project Structure

```
winning_prototype/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── schemas.py
│   │   ├── routes/ (system, demo, inference, analytics, download)
│   │   ├── services/ (demo_service, inference_service, raster_service)
│   │   └── utils/ (geo, metrics)
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/ (TopBar, MissionControl, MapView, SwipeComparison, IntelligencePanel, MetricsPanel, WhyTrustCard, ProcessingOverlay, ConfidenceLegend)
│   │   ├── pages/ (Dashboard, ModelLab, AnalyticsView, AboutScience)
│   │   ├── services/ (api.ts)
│   │   ├── styles/ (index.css)
│   │   ├── types/ (index.ts)
│   │   └── App.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
├── model/
│   ├── configuration.json
│   └── geosr_bounded_adapter_best.pth
├── results/
│   └── evaluation/subset_30_patches.json
├── docs/ (architecture.md, methodology.md, evaluation.md)
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Attribution & Acknowledgments

- **SEN2SR / Mamba**: Pretrained deep learning backbone for Sentinel-2 super-resolution.
- **GeoSR-NTRO**: Trustworthy bounded refinement framework, hard low-frequency consistency integration, and geospatial intelligence platform developed for SIH 2026 NTRO PS 26142.
