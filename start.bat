@echo off
echo ========================================
echo   Vehicle Management System - Startup
echo ========================================
echo.

echo Checking if MongoDB is running...
net start | findstr /i "MongoDB" > nul
if %errorlevel% == 0 (
    echo [OK] MongoDB is running
) else (
    echo [!] MongoDB is not running
    echo Starting MongoDB...
    net start MongoDB
    if %errorlevel% == 0 (
        echo [OK] MongoDB started successfully
    ) else (
        echo [ERROR] Failed to start MongoDB
        echo Please start MongoDB manually
        pause
        exit /b 1
    )
)

echo.
echo Starting Backend Server...
echo.
start "Backend Server" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak > nul

echo.
echo Starting Frontend Server...
echo.
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Application Starting...
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Demo Accounts:
echo   Owner:   owner@fleet.com / password123
echo   Manager: manager@fleet.com / password123
echo   Driver:  driver@fleet.com / password123
echo.
echo Press any key to exit this window...
echo (Backend and Frontend will keep running)
echo ========================================
pause > nul
