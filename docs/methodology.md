# GeoSR-NTRO Scientific Methodology

## Core Positioning Statement

> *"We don't hallucinate a sharper satellite image. We generate a higher-resolution representation constrained by what the satellite actually observed."*

## Model Components

1. **Backbone**: SEN2SR / Mamba pretrained spatial reconstruction network (frozen during refinement adapter training).
2. **Refinement Adapter**: Bounded parameter network (~11,588 trainable parameters) learning localized edge and texture refinements.
3. **Hard Constraint**: SEN2SR Low-Frequency Projection enforcing exact observation preservation.
4. **Uncertainty Head**: Predicts spatial variance / model confidence proxy to highlight potential edge refinement uncertainty.
