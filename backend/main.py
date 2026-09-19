import sys
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Add backend directory to sys.path
BACKEND_DIR = Path(__file__).resolve().parent
sys.path.append(str(BACKEND_DIR))

from config import UPLOADS_DIR, MODEL_NAME
from database import init_db
from routers import predictions, hardware, model_info

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on startup
    init_db()
    print("[Startup] SQLite database initialized.")
    yield
    print("[Shutdown] Cleaning up resources.")

app = FastAPI(
    title="Wildlife Footprint Recognition API",
    description="AMSF-Net inference and Raspberry Pi 3 telemetry API",
    version="2.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded footprint images for preview
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")

# Include routers
app.include_router(predictions.router)
app.include_router(hardware.router)
app.include_router(model_info.router)

@app.get("/")
def root():
    return {
        "title": "Wildlife Footprint AI",
        "description": "AI-Based Wildlife Footprint Recognition using AMSF-Net",
        "model": MODEL_NAME,
        "status": "online",
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "ai_engine": "online",
        "model": MODEL_NAME,
        "classes": ["Deer", "Tiger", "Wolf"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
