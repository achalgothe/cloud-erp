@echo off
echo ========================================
echo   Cloud ERP System - Stop Script
echo ========================================
echo.

echo Stopping all containers...
docker-compose down
echo.

echo Cleanup complete!
echo.
pause
