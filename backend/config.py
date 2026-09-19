import os
from pathlib import Path

# Base paths
BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BACKEND_DIR.parent

# Storage and uploads
STORAGE_DIR = BACKEND_DIR / "storage"
UPLOADS_DIR = STORAGE_DIR / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

# Database
DB_PATH = BACKEND_DIR / "wildlife_ai.db"

# Model paths
MODEL_DIR = PROJECT_ROOT / "model"
WEIGHTS_DIR = MODEL_DIR / "weights"
WEIGHTS_PATH = WEIGHTS_DIR / "best_amsfnet_exp2.pth"

# Model metadata (Exact project facts)
MODEL_NAME = "AMSF-Net"
MODEL_FULL_NAME = "Adaptive Multi-Scale Feature Fusion Network"
CLASSES = ["Deer", "Tiger", "Wolf"]
INPUT_SIZE = (224, 224)
TRAINABLE_PARAMETERS = 155173
VALIDATION_ACCURACY = 84.13

# Telemetry timeout (seconds after which device is considered disconnected)
DEVICE_HEARTBEAT_TIMEOUT = 15.0
