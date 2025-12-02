@echo off
echo ========================================
echo   Database Setup for MongoDB Compass
echo ========================================
echo.

cd backend

echo Step 1: Clearing old database...
node clear-db.js
if %errorlevel% neq 0 (
    echo [ERROR] Failed to clear database
    pause
    exit /b 1
)

echo.
echo Step 2: Seeding fresh data...
node seed.js
if %errorlevel% neq 0 (
    echo [ERROR] Failed to seed database
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCESS! Database is Ready
echo ========================================
echo.
echo Now open MongoDB Compass and:
echo.
echo 1. Connect to: mongodb://localhost:27017
echo 2. Click database: vehicle_management
echo 3. View collections:
echo    - users (4 documents)
echo    - vehicles (5 documents)
echo    - trips (3 documents)
echo.
echo Demo Accounts:
echo   owner@fleet.com / password123
echo   manager@fleet.com / password123
echo   driver@fleet.com / password123
echo.
echo ========================================
pause
