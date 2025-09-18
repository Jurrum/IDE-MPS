# React + p5.js Creative Sketch

I buildt an interactive generative art application that lets you create beautiful moving patterns with real-time controls using Claude code within the 

## Features

- **Interactive Art Generation**: Watch colorful particles move in dynamic patterns
- **Real-time Controls**: Adjust colors, speed, density, shapes, and movement patterns
- **Multiple Particle Shapes**: Circle, square, triangle, star, hexagon, and morphing shapes
- **Movement Patterns**: Linear, sine wave, circular, spiral, bouncing, and chaotic motion
- **Trail System**: Particles can leave colored trails as they move
- **Export Functionality**: Save your creations as PNG images
- **Responsive Design**: Works on desktop and mobile devices

## Quick Start

### Option 1: Automatic Startup (Recommended)

**Windows:**
1. Double-click `start.bat` in the project folder
2. Wait for dependencies to install (first run only)
3. The application will open automatically in your browser

**Mac/Linux:**
1. Open terminal in the project folder
2. Run `./start.sh`
3. Wait for dependencies to install (first run only)
4. The application will open automatically in your browser

### Option 2: Manual Startup

1. Make sure you have Node.js 20.19+ installed
2. Open terminal/command prompt in this directory
3. Run `npm install` (first time only)
4. Run `npm run dev`
5. Open http://localhost:5173 in your browser

## How to Use

1. **Basic Controls**: Adjust color palette, motion speed, and particle density
2. **Appearance**: Choose different particle shapes and size variations
3. **Movement**: Select movement patterns, enable trails, and control rotation
4. **Export**: Click "Export Image" to save your current creation

## Requirements

- Node.js 20.19+ or 22.12+
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for initial setup)

## Troubleshooting

- **Node.js version error**: Update to Node.js 20.19+ or newer
- **Dependencies fail to install**: Check internet connection and try again
- **Application doesn't load**: Make sure you're accessing http://localhost:5173
- **Performance issues**: Try reducing particle density or disabling trails

## Development

Built with:
- React 18
- p5.js (direct integration)
- Vite (build tool)
- CSS modules for styling

To modify the code:
1. Edit files in the `src/` directory
2. Changes will automatically reload in the browser
3. Run `npm run build` to create production version


Run wsl Ubuntu

move to 
cd /mnt/c/Users/jbdbo/Documents/Windsurf/IDE-MPS/make-it-prototyping/rounds/round-01/src/react-p5-sketch

use command:
npm run dev
