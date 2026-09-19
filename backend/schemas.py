from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class ProbabilityDistribution(BaseModel):
    Deer: float = Field(..., description="Softmax probability for Deer")
    Tiger: float = Field(..., description="Softmax probability for Tiger")
    Wolf: float = Field(..., description="Softmax probability for Wolf")

class PredictionResponse(BaseModel):
    id: int
    prediction: str
    confidence: float
    probabilities: ProbabilityDistribution
    inference_time_ms: float
    source: str
    timestamp: str
    model: str
    device: Optional[str] = None
    image_url: Optional[str] = None

class PredictionHistoryResponse(BaseModel):
    total: int
    items: List[PredictionResponse]

class HardwareRegisterRequest(BaseModel):
    device_id: str = Field("rpi3-wildlife-01", description="Unique hardware identifier")
    camera_type: Optional[str] = Field("Raspberry Pi Camera Module v2", description="Camera module type")
    ip_address: Optional[str] = Field(None, description="Local IP address of Raspberry Pi")
    status: Optional[str] = Field("CONNECTED", description="Device status")

class HardwareStatusResponse(BaseModel):
    device_status: str = Field(..., description="CONNECTED | WAITING FOR DEVICE")
    camera_status: str = Field(..., description="ACTIVE | WAITING")
    network_status: str = Field(..., description="CONNECTED | WAITING")
    last_seen: Optional[str] = None
    latest_prediction: Optional[PredictionResponse] = None

class ModelInfoResponse(BaseModel):
    model_name: str
    full_name: str
    classes: List[str]
    parameters: int
    input_size: str
    validation_accuracy: float

class ModelPerformanceResponse(BaseModel):
    validation_accuracy: float
    parameters: int
    training_accuracy: Optional[float] = None
    test_accuracy: Optional[float] = None
    precision: Optional[float] = None
    recall: Optional[float] = None
    f1_score: Optional[float] = None
    confusion_matrix: Optional[Any] = None
    message: str = "Unconfigured metrics are not fabricated and display as unconfigured."
