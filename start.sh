#!/bin/bash

echo "========================================"
echo "  Vehicle Management System - Startup"
echo "========================================"
echo ""

# Check if MongoDB is running
if pgrep -x "mongod" > /dev/null
then
    echo "[OK] MongoDB is running"
else
    echo "[!] MongoDB is not running"
    echo "Starting MongoDB..."
    sudo systemctl start mongod
    if [ $? -eq 0 ]; then
        echo "[OK] MongoDB started successfully"
    else
        echo "[ERROR] Failed to start MongoDB"
        echo "Please start MongoDB manually"
        exit 1
    fi
fi

echo ""
echo "Starting Backend Server..."
echo ""
cd backend
gnome-terminal -- bash -c "npm start; exec bash" 2>/dev/null || \
xterm -e "npm start" 2>/dev/null || \
npm start &

sleep 3

echo ""
echo "Starting Frontend Server..."
echo ""
cd ../frontend
gnome-terminal -- bash -c "npm run dev; exec bash" 2>/dev/null || \
xterm -e "npm run dev" 2>/dev/null || \
npm run dev &

echo ""
echo "========================================"
echo "  Application Starting..."
echo "========================================"
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Demo Accounts:"
echo "  Owner:   owner@fleet.com / password123"
echo "  Manager: manager@fleet.com / password123"
echo "  Driver:  driver@fleet.com / password123"
echo ""
echo "========================================"
