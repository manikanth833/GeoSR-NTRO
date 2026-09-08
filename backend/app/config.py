import os
from pydantic_settings import BaseSettings
from typing import List, Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "GeoSR-NTRO"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Execution mode
    DEMO_MODE: bool = True
    
    # Paths
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    DATA_DIR: str = os.path.join(BASE_DIR, "data", "demo")
    MODEL_DIR: str = os.path.join(BASE_DIR, "model")
    RESULTS_DIR: str = os.path.join(BASE_DIR, "results")
    
    # Allowed CORS Origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "*"
    ]

    class Config:
        case_sensitive = True

settings = Settings()
