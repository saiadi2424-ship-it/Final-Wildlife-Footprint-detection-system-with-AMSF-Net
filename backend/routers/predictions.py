import uuid
import datetime
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from schemas import PredictionResponse, PredictionHistoryResponse
from services.model_service import model_service
from services.history_service import history_service
from config import UPLOADS_DIR

router = APIRouter(tags=["Predictions"])

@router.post("/predict", response_model=PredictionResponse)
async def predict_footprint(
    file: UploadFile = File(...),
    source: str = Form("web")
):
    """
    Classifies an uploaded wildlife footprint image using AMSF-Net.
    Accepts:
        file: Multipart image file
        source: 'web' or 'raspberry_pi'
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a valid image (JPEG/PNG/WEBP).")

    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Uploaded image file is empty.")

    # Generate unique filename and persist image for preview in history
    extension = Path(file.filename).suffix if file.filename else ".jpg"
    if not extension or len(extension) > 5:
        extension = ".jpg"
        
    saved_filename = f"{uuid.uuid4().hex[:12]}{extension}"
    file_path = UPLOADS_DIR / saved_filename
    with open(file_path, "wb") as f:
        f.write(contents)

    # Perform PyTorch inference
    try:
        result = model_service.predict(contents)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AMSF-Net inference failed: {str(e)}")

    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    
    # Store in database
    db_record = history_service.record_prediction(
        timestamp=now_iso,
        source=source.lower(),
        image_filename=saved_filename,
        prediction=result["prediction"],
        confidence=result["confidence"],
        prob_deer=result["probabilities"]["Deer"],
        prob_tiger=result["probabilities"]["Tiger"],
        prob_wolf=result["probabilities"]["Wolf"],
        inference_time_ms=result["inference_time_ms"],
        device=result.get("device")
    )

    return db_record

@router.get("/predictions/history", response_model=PredictionHistoryResponse)
def get_prediction_history(
    source: str = "all",
    search: str = "",
    limit: int = 50,
    offset: int = 0
):
    """
    Retrieves paginated prediction history with optional source filtering and search.
    """
    total, items = history_service.get_history(
        source=source if source != "all" else None,
        search=search if search.strip() else None,
        limit=limit,
        offset=offset
    )
    return {"total": total, "items": items}

@router.delete("/predictions/history")
def clear_prediction_history():
    """
    Clears all saved prediction history.
    """
    count = history_service.clear_history()
    return {"status": "cleared", "count": count}
