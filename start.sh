#!/bin/bash

# MY Internship Platform - Quick Start Script
# This script sets up and runs the entire platform

echo "🚀 MY Internship Platform - Quick Start"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL not found. Using SQLite for demo (lightweight)"
    USE_SQLITE=true
else
    echo "✅ PostgreSQL found"
fi

echo ""
echo "📦 Installing dependencies..."

# Setup Backend
echo ""
echo "🔧 Setting up Backend..."
cd backend
npm install --quiet
cp .env.example .env
echo "✅ Backend ready"

# Setup Frontend
echo ""
echo "🎨 Setting up Frontend..."
cd ../frontend
npm install --quiet
cp .env.example .env.local
echo "✅ Frontend ready"

echo ""
echo "========================================"
echo "✨ Setup Complete!"
echo "========================================"
echo ""
echo "🚀 Starting the application..."
echo ""
echo "📍 Frontend will run on: http://localhost:3000"
echo "📍 Backend will run on: http://localhost:5000"
echo ""
echo "Opening browser in 5 seconds..."
echo ""

# Start Backend
echo "Starting Backend..."
cd ../backend
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start Frontend
echo "Starting Frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Wait a bit then open browser
sleep 5

if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:3000
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open http://localhost:3000
elif [[ "$OSTYPE" == "msys" ]]; then
    start http://localhost:3000
fi

echo ""
echo "========================================"
echo "✅ Application is running!"
echo "========================================"
echo ""
echo "Press Ctrl+C to stop the application"
echo ""

# Keep script running
wait
