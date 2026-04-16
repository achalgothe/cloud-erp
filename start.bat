@echo off
echo ========================================
echo   Cloud ERP System - Setup Script
echo ========================================
echo.

echo [1/4] Checking Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed!
    echo Please install Docker Desktop from:
    echo https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)
echo Docker found!
echo.

echo [2/4] Stopping any existing containers...
docker-compose down >nul 2>&1
echo.

echo [3/4] Building and starting containers...
echo This may take a few minutes on first run...
echo.
docker-compose up --build -d

if %errorlevel% neq 0 (
    echo ERROR: Failed to start containers
    pause
    exit /b 1
)
echo.

echo [4/4] Waiting for services to be ready...
timeout /t 10 /nobreak >nul
echo.

echo ========================================
echo   SETUP COMPLETE!
echo ========================================
echo.
echo Frontend: http://localhost
echo Backend:  http://localhost:5000
echo API Docs: http://localhost:5000/api/health
echo.
echo To view logs: docker-compose logs -f
echo To stop: docker-compose down
echo.
echo Opening browser...
start http://localhost
echo.
pause
