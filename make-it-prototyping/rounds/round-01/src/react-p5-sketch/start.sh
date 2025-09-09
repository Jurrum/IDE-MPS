#!/bin/bash

# React + p5.js Creative Sketch Starter Script
# This script will install dependencies and start the development server

echo "🎨 React + p5.js Creative Sketch"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from: https://nodejs.org/"
    echo "Required version: 20.19+ or 22.12+"
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v)
echo "✅ Node.js found: $NODE_VERSION"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed!"
    echo "npm should come with Node.js. Please reinstall Node.js."
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi

NPM_VERSION=$(npm -v)
echo "✅ npm found: $NPM_VERSION"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "Please make sure you're running this script from the react-p5-sketch directory"
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi

echo "📦 Installing dependencies..."
echo "This may take a few minutes on first run..."
echo ""

# Install dependencies
if npm install; then
    echo ""
    echo "✅ Dependencies installed successfully!"
else
    echo ""
    echo "❌ Failed to install dependencies!"
    echo "Please check your internet connection and try again."
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi

echo ""
echo "🚀 Starting development server..."
echo ""
echo "The application will open in your browser automatically."
echo "If it doesn't open, navigate to: http://localhost:5173"
echo ""
echo "To stop the server, press Ctrl+C"
echo ""

# Start the development server
npm run dev

echo ""
echo "👋 Development server stopped."
read -p "Press Enter to exit..."