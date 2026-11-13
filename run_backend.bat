@echo off
echo ========================================================
echo Starting Polar Outreach Agent - FastAPI Backend
echo MoES SIH26063 - Machine Learning API Server
echo ========================================================
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
pause

