from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import system, demo, inference, analytics, download

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Trustworthy Deep Learning Super-Resolution for Sentinel-2 Satellite Imagery (SIH 2026 / NTRO PS 26142)"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(system.router, prefix=settings.API_V1_STR, tags=["System"])
app.include_router(demo.router, prefix=settings.API_V1_STR, tags=["Demo & Rasters"])
app.include_router(inference.router, prefix=settings.API_V1_STR, tags=["Inference"])
app.include_router(analytics.router, prefix=settings.API_V1_STR, tags=["Analytics"])
app.include_router(download.router, prefix=settings.API_V1_STR, tags=["Downloads"])

@app.get("/")
def root():
    return {
        "project": settings.PROJECT_NAME,
        "status": "ONLINE",
        "demo_mode": settings.DEMO_MODE,
        "docs_url": "/docs",
        "api_v1": settings.API_V1_STR
    }
