@echo off
REM MY Internship Platform - Quick Start Script for Windows

echo.
echo 🚀 MY Internship Platform - Quick Start
echo ========================================
echo.

REM Check if Node.js is installed
where /q node
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+
    pause
    exit /b 1
)

echo ✅ Node.js found

echo.
echo 📦 Installing dependencies...

REM Setup Backend
echo.
echo 🔧 Setting up Backend...
cd backend
call npm install --quiet
copy .env.example .env >nul 2>&1
echo ✅ Backend ready

REM Setup Frontend
echo.
echo 🎨 Setting up Frontend...
cd ..
cd frontend
call npm install --quiet
copy .env.example .env.local >nul 2>&1
echo ✅ Frontend ready

echo.
echo ========================================
echo ✨ Setup Complete!
echo ========================================
echo.
echo 🚀 Starting the application...
echo.
echo 📍 Frontend will run on: http://localhost:3000
echo 📍 Backend will run on: http://localhost:5000
echo.

cd ..

REM Start Backend in new window
cd backend
start cmd /k "npm run dev"

REM Wait and start Frontend
timeout /t 3 /nobreak
cd ..
cd frontend
start cmd /k "npm run dev"

REM Wait and open browser
timeout /t 5 /nobreak
start http://localhost:3000

echo.
echo ========================================
echo ✅ Application is running!
echo ========================================
echo.
echo Open http://localhost:3000 in your browser
echo Press Ctrl+C in the terminal windows to stop
echo.
pause
