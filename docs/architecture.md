# GeoSR-NTRO Architecture & Technical Pipeline

GeoSR-NTRO converts Sentinel-2 L2A satellite imagery from ~10 m spatial resolution into a 2.5 m super-resolved geospatial representation (4× scale), constrained by physical observation consistency.

## Core Pipeline Flow

```
Sentinel-2 RGBN Input (10 m)
        ↓
SEN2SR / Mamba Pretrained Backbone
        ↓
Bounded GeoSR Refinement Adapter (~11,588 params)
        ↓
Hard Low-Frequency Consistency Constraint (SEN2SR HardConstraint)
        ↓
2.5 m Super-Resolution Output
        ↓
┌───────────────────────┬───────────────────────┬───────────────────────┐
↓                       ↓                       ↓                       ↓
Model Confidence Proxy  NDVI Vegetation Index  NDWI Water Index  Building/Road Segmentation
```

## Physical Consistency Formula

For any generated 2.5 m super-resolution output $\hat{x} \in \mathbb{R}^{C \times 4H \times 4W}$, the SEN2SR `HardConstraint` forces:

$$\mathcal{D}(\hat{x}) \equiv x_{10m}$$

where $\mathcal{D}$ denotes spatial degradation (average pooling over $4 \times 4$ blocks), ensuring zero low-frequency hallucination relative to what Sentinel-2 actually observed.
