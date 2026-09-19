import datetime
from fastapi import APIRouter
from schemas import HardwareStatusResponse, HardwareRegisterRequest
from services.history_service import history_service

router = APIRouter(prefix="/hardware", tags=["Hardware Telemetry"])

@router.get("/latest", response_model=HardwareStatusResponse)
def get_latest_hardware_telemetry():
    """
    Returns real-time status of Raspberry Pi 3 hardware, camera, network,
    and the latest prediction originating from the hardware.
    """
    return history_service.get_hardware_status()

@router.post("/register")
def register_hardware_device(req: HardwareRegisterRequest):
    """
    Receives heartbeat and registration from Raspberry Pi 3 client.
    """
    history_service.register_hardware(
        device_id=req.device_id,
        ip_address=req.ip_address,
        camera_type=req.camera_type,
        status=req.status or "CONNECTED"
    )
    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    return {
        "status": "registered",
        "device_id": req.device_id,
        "acknowledged_at": now_iso
    }

@router.post("/heartbeat")
def hardware_heartbeat(device_id: str = "rpi3-wildlife-01"):
    """
    Lightweight keep-alive ping from the Raspberry Pi 3 client.
    """
    history_service.register_hardware(
        device_id=device_id,
        ip_address=None,
        camera_type="Raspberry Pi Camera Module v2",
        status="CONNECTED"
    )
    return {"status": "alive", "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()}
