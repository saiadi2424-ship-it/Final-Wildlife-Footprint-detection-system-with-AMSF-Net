# Raspberry Pi 3 Hardware Integration Guide

This guide describes how to deploy the edge camera client on a **Raspberry Pi 3 Model B** to capture wildlife footprints and stream them to the **AMSF-Net** backend.

---

## 1. Hardware Requirements
- **Raspberry Pi 3 Model B / B+**
- **Raspberry Pi Camera Module v2** (or standard USB UVC webcam)
- **32 GB Micro-SD Card** (Class 10 / UHS-1 recommended)
- **5V 2.5A Power Supply**
- Local Wi-Fi or Ethernet connection

---

## 2. Raspberry Pi Setup & Camera Enablement
1. Flash **Raspberry Pi OS (64-bit or 32-bit)** to the 32 GB Micro-SD card using Raspberry Pi Imager.
2. Insert the camera ribbon cable into the CSI camera port (silver contacts facing HDMI port).
3. Boot the Pi and run:
   ```bash
   sudo raspi-config
   ```
   Navigate to **Interface Options** -> **Camera** -> **Enable**.
4. Reboot the Pi:
   ```bash
   sudo reboot
   ```

---

## 3. Install Client Dependencies
On the Raspberry Pi terminal:
```bash
sudo apt-get update
sudo apt-get install -y python3-pip python3-picamera2 python3-requests
# Alternatively for USB cameras:
sudo apt-get install -y python3-opencv fswebcam
```

---

## 4. Running the Client
Clone or copy `pi_client.py` to your Raspberry Pi, then run:

```bash
python3 pi_client.py --server http://<FASTAPI_SERVER_IP>:8000 --interval 10
```

- `--server`: IP address of the machine running the FastAPI backend.
- `--interval`: Delay between automated footprint image captures (default: 15 seconds).
- `--single-shot`: Send a single test footprint image and exit:
  ```bash
  python3 pi_client.py --server http://<FASTAPI_SERVER_IP>:8000 --single-shot test_footprint.jpg
  ```

---

## 5. System Flow
1. **Camera Sensor** captures wildlife track.
2. `pi_client.py` wraps image in HTTP multipart form-data.
3. Client dispatches `POST /predict` with `source="raspberry_pi"`.
4. FastAPI invokes **AMSF-Net** on the server.
5. Softmax predictions (`Deer`, `Tiger`, or `Wolf`) are returned to the Pi and stored in the database.
6. The web dashboard updates in real-time via `GET /hardware/latest`.
