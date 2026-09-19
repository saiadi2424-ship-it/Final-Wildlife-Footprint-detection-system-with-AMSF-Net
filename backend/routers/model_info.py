from fastapi import APIRouter
from schemas import ModelInfoResponse, ModelPerformanceResponse
from config import (
    MODEL_NAME,
    MODEL_FULL_NAME,
    CLASSES,
    TRAINABLE_PARAMETERS,
    VALIDATION_ACCURACY,
    INPUT_SIZE
)

router = APIRouter(prefix="/model", tags=["Model Information"])

@router.get("/info", response_model=ModelInfoResponse)
def get_model_information():
    """
    Returns verified facts and architecture metadata for AMSF-Net.
    """
    return {
        "model_name": MODEL_NAME,
        "full_name": MODEL_FULL_NAME,
        "classes": CLASSES,
        "parameters": TRAINABLE_PARAMETERS,
        "input_size": f"{INPUT_SIZE[0]} × {INPUT_SIZE[1]} RGB",
        "validation_accuracy": VALIDATION_ACCURACY
    }

@router.get("/performance", response_model=ModelPerformanceResponse)
def get_model_performance():
    """
    Returns known, verified validation metrics for AMSF-Net.
    Unconfigured metrics remain null/unconfigured and are never fabricated.
    """
    return {
        "validation_accuracy": VALIDATION_ACCURACY,
        "parameters": TRAINABLE_PARAMETERS,
        "training_accuracy": None,
        "test_accuracy": None,
        "precision": None,
        "recall": None,
        "f1_score": None,
        "confusion_matrix": None,
        "message": "Only verified benchmark metrics (Validation Accuracy: 84.13%, Parameters: 155,173) are active. Unconfigured metrics are not fabricated."
    }
