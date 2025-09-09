@echo off
title React + p5.js Creative Sketch

echo 🎨 React + p5.js Creative Sketch
echo ================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    echo Required version: 20.19+ or 22.12+
    echo.
    pause
    exit /b 1
)

REM Get Node.js version
for /f "tokens=*" %%a in ('node --version') do set NODE_VERSION=%%a
echo ✅ Node.js found: %NODE_VERSION%

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed!
    echo npm should come with Node.js. Please reinstall Node.js.
    echo.
    pause
    exit /b 1
)

REM Get npm version
for /f "tokens=*" %%a in ('npm --version') do set NPM_VERSION=%%a
echo ✅ npm found: %NPM_VERSION%
echo.

REM Check if we're in the right directory
if not exist package.json (
    echo ❌ Error: package.json not found!
    echo Please make sure you're running this script from the react-p5-sketch directory
    echo.
    pause
    exit /b 1
)

echo 📦 Installing dependencies...
echo This may take a few minutes on first run...
echo.

REM Install dependencies
call npm install
if %errorlevel% neq 0 (
    echo.
    echo ❌ Failed to install dependencies!
    echo Please check your internet connection and try again.
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Dependencies installed successfully!
echo.
echo 🚀 Starting development server...
echo.
echo The application will open in your browser automatically.
echo If it doesn't open, navigate to: http://localhost:5173
echo.
echo To stop the server, press Ctrl+C
echo.

REM Start the development server
call npm run dev

echo.
echo 👋 Development server stopped.
pause