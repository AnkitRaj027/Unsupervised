Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Starting Polar Outreach Agent - FastAPI Backend (Port 8000)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot\backend"
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload

