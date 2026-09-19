# Wildlife Footprint AI - Startup Script
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " Wildlife Footprint AI Platform (AMSF-Net)" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan

$CurrentDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start FastAPI Backend in background job
Write-Host "[1/2] Starting FastAPI Backend on http://localhost:8000..." -ForegroundColor Yellow
$BackendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$CurrentDir\backend'; python main.py" -PassThru

# Start Vite Frontend
Write-Host "[2/2] Starting Vite Frontend on http://localhost:5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$CurrentDir\frontend'; npm run dev"

Write-Host "`nPlatform launched!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "Backend API: http://localhost:8000 (Swagger docs: http://localhost:8000/docs)" -ForegroundColor White
Write-Host "`nTo test with simulated hardware, toggle 'DEMO MODE' in the top header." -ForegroundColor Magenta
