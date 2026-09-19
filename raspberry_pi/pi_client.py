#!/usr/bin/env python3
"""
Wildlife Footprint AI - Raspberry Pi 3 Client
Captures footprint images using Raspberry Pi Camera and posts to FastAPI backend.

Usage:
    python3 pi_client.py --server http://<SERVER_IP>:8000 --interval 10
"""

import os
import sys
import time
import argparse
import datetime
import requests
from pathlib import Path

# Camera library detection
CAMERA_BACKEND = None
try:
    from picamera2 import Picamera2
    CAMERA_BACKEND = "picamera2"
except ImportError:
    try:
        import cv2
        CAMERA_BACKEND = "opencv"
    except ImportError:
        CAMERA_BACKEND = "fswebcam"

DEVICE_ID = "rpi3-wildlife-01"
CAMERA_NAME = f"Raspberry Pi Camera ({CAMERA_BACKEND})"

def get_local_ip():
    """Attempts to find the device's local network IP."""
    import socket
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

def register_with_backend(server_url: str):
    """Sends registration and heartbeat signal to the backend."""
    register_url = f"{server_url.rstrip('/')}/hardware/register"
    payload = {
        "device_id": DEVICE_ID,
        "camera_type": CAMERA_NAME,
        "ip_address": get_local_ip(),
        "status": "CONNECTED"
    }
    try:
        res = requests.post(register_url, json=payload, timeout=5)
        if res.status_code == 200:
            print(f"[Pi Client] Registered with backend: {res.json()}")
            return True
        else:
            print(f"[Pi Client] Registration error ({res.status_code}): {res.text}")
            return False
    except Exception as e:
        print(f"[Pi Client] Failed to reach backend at {register_url}: {e}")
        return False

def capture_image(output_path: str) -> bool:
    """Captures a frame using the available camera backend."""
    print(f"[Pi Client] Capturing image using backend: {CAMERA_BACKEND}...")
    
    if CAMERA_BACKEND == "picamera2":
        try:
            picam2 = Picamera2()
            config = picam2.create_still_configuration(main={"size": (1280, 720)})
            picam2.configure(config)
            picam2.start()
            time.sleep(1) # Sensor settle time
            picam2.capture_file(output_path)
            picam2.close()
            return True
        except Exception as e:
            print(f"[Pi Client] picamera2 capture failed: {e}")
            return False

    elif CAMERA_BACKEND == "opencv":
        try:
            cap = cv2.VideoCapture(0)
            if not cap.isOpened():
                print("[Pi Client] OpenCV could not open camera index 0.")
                return False
            time.sleep(1)
            ret, frame = cap.read()
            cap.release()
            if ret:
                cv2.imwrite(output_path, frame)
                return True
            return False
        except Exception as e:
            print(f"[Pi Client] OpenCV capture failed: {e}")
            return False

    else:
        # Fallback to fswebcam command
        exit_code = os.system(f"fswebcam -r 1280x720 --no-banner '{output_path}' >/dev/null 2>&1")
        return exit_code == 0

def send_prediction(server_url: str, image_path: str):
    """Uploads captured footprint to FastAPI for AMSF-Net classification."""
    predict_url = f"{server_url.rstrip('/')}/predict"
    if not os.path.exists(image_path):
        print(f"[Pi Client] Error: File {image_path} does not exist.")
        return None

    try:
        with open(image_path, "rb") as img_file:
            files = {"file": (os.path.basename(image_path), img_file, "image/jpeg")}
            data = {"source": "raspberry_pi"}
            start = time.perf_counter()
            response = requests.post(predict_url, files=files, data=data, timeout=15)
            duration_ms = round((time.perf_counter() - start) * 1000, 2)

        if response.status_code == 200:
            result = response.json()
            print("\n==============================================")
            print(f" [PREDICTION RECEIVED FROM AMSF-Net]")
            print(f" Species:        {result['prediction'].upper()}")
            print(f" Confidence:     {result['confidence']}%")
            print(f" Inference Time: {result['inference_time_ms']} ms")
            print(f" Roundtrip:      {duration_ms} ms")
            print(f" Probabilities:  {result['probabilities']}")
            print("==============================================\n")
            return result
        else:
            print(f"[Pi Client] Prediction API error ({response.status_code}): {response.text}")
            return None
    except Exception as e:
        print(f"[Pi Client] Network error posting to {predict_url}: {e}")
        return None

def main():
    parser = argparse.ArgumentParser(description="Wildlife Footprint AI - Raspberry Pi 3 Client")
    parser.add_argument("--server", type=str, default="http://localhost:8000", help="FastAPI server URL")
    parser.add_argument("--interval", type=int, default=15, help="Capture interval in seconds")
    parser.add_argument("--single-shot", type=str, default=None, help="Upload a specific single image and exit")
    args = parser.parse_args()

    print(f"==================================================")
    print(f" Wildlife Footprint AI - Raspberry Pi 3 Client")
    print(f" Backend URL:  {args.server}")
    print(f" Device ID:    {DEVICE_ID}")
    print(f" Camera:       {CAMERA_NAME}")
    print(f"==================================================")

    # Initial registration
    register_with_backend(args.server)

    if args.single_shot:
        send_prediction(args.server, args.single_shot)
        return

    # Continuous acquisition loop
    temp_dir = Path("/tmp/wildlife_captures") if os.name != "nt" else Path("./temp_captures")
    temp_dir.mkdir(parents=True, exist_ok=True)

    try:
        while True:
            # Send keep-alive heartbeat
            register_with_backend(args.server)
            
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            capture_path = str(temp_dir / f"footprint_{timestamp}.jpg")

            success = capture_image(capture_path)
            if success and os.path.exists(capture_path):
                print(f"[Pi Client] Image saved to {capture_path}, uploading to AMSF-Net...")
                send_prediction(args.server, capture_path)
            else:
                print("[Pi Client] Camera capture skipped or camera not connected.")

            print(f"[Pi Client] Waiting {args.interval}s until next acquisition cycle...")
            time.sleep(args.interval)

    except KeyboardInterrupt:
        print("\n[Pi Client] Stopped by user.")

if __name__ == "__main__":
    main()
