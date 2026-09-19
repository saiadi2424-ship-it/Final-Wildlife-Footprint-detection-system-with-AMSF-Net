# AI-Based Wildlife Footprint Recognition System Using AMSF-Net

A modern, production-grade AI platform for wildlife footprint classification, edge camera monitoring, and empirical model inspection. Built from the ground up for the final-year research project.

---

## 🐾 Project Highlights
- **Deep Learning Architecture**: **AMSF-Net** (Adaptive Multi-Scale Feature Fusion Network)
- **Supported Classes**: **Deer**, **Tiger**, **Wolf**
- **Input Dimensions**: 224 × 224 RGB
- **Trainable Parameters**: **155,173**
- **Verified Validation Accuracy**: **84.13%**
- **Edge Deployment**: Raspberry Pi 3 Model B + Camera Module + 32 GB Micro-SD
- **Central API**: FastAPI (Asynchronous Python 3) + PyTorch runtime
- **Research Dashboard**: React + Vite + Tailwind CSS + Recharts + Lucide Icons

---

## 📁 Repository Structure
```
wildlife-ai-platform/
│
├── frontend/                     # React 18 + Vite research dashboard
│   ├── src/
│   │   ├── api/client.js         # REST client for FastAPI backend
│   │   ├── context/              # SystemContext (telemetry polling, demo mode)
│   │   ├── components/           # Modular UI & glassmorphic components
│   │   └── pages/                # 8 comprehensive dashboard pages
│   └── package.json
│
├── backend/                      # FastAPI REST & ML inference engine
│   ├── main.py                   # App entrypoint, CORS, static uploads
│   ├── database.py               # SQLite WAL mode database manager
│   ├── schemas.py                # Pydantic v2 schemas
│   ├── services/                 # PyTorch model service & history service
│   ├── routers/                  # Predictions, hardware, and model info routes
│   └── requirements.txt
│
├── model/                        # Deep Learning Architecture
│   ├── amsfnet.py                # PyTorch nn.Module for AMSF-Net
│   └── weights/                  # Destination for best_amsfnet_exp2.pth
│
├── raspberry_pi/                 # Edge hardware integration
│   ├── pi_client.py              # Standalone camera capture & streaming client
│   └── README_RPI.md             # Complete Raspberry Pi 3 setup guide
│
├── start_platform.ps1            # One-click Windows launch script
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Backend Setup
From the project root:
```powershell
cd backend
python -m pip install -r requirements.txt
python main.py
```
Backend API will start at: `http://localhost:8000` (Interactive docs: `http://localhost:8000/docs`).

### 2. Frontend Setup
In a separate terminal:
```powershell
cd frontend
npm install
npm run dev
```
Frontend dashboard will open at: `http://localhost:5173`.

### 3. One-Click Launch (Windows PowerShell)
Alternatively, execute:
```powershell
.\start_platform.ps1
```

---

## 📷 Raspberry Pi 3 Hardware Integration
The Raspberry Pi 3 runs `pi_client.py` to capture wildlife footprints from field cameras and stream them to the central FastAPI backend:

```bash
python3 raspberry_pi/pi_client.py --server http://<SERVER_IP>:8000 --interval 15
```

- When the physical Pi is not connected, the dashboard displays: **WAITING FOR RASPBERRY PI**.
- Use the **DEMO MODE** toggle in the header to simulate hardware events during demonstrations.

---

## ⚖️ Academic Integrity & Metric Policy
In strict adherence to research standards:
- Verified metrics (155,173 parameters, 84.13% validation accuracy) are highlighted.
- Unconfigured metrics (e.g., test accuracy, precision, recall, F1, confusion matrix) display as **"Metric not currently configured"** and are never synthetically fabricated.
