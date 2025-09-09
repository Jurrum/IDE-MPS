import { useState, useRef } from 'react'
import P5Sketch from './components/P5Sketch'
import './App.css'

function App() {
  const [colorPalette, setColorPalette] = useState('warm')
  const [motionSpeed, setMotionSpeed] = useState(1)
  const [patternDensity, setPatternDensity] = useState(50)
  const sketchRef = useRef()

  const handleExport = () => {
    if (sketchRef.current && sketchRef.current.exportImage) {
      sketchRef.current.exportImage()
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>React + p5.js Creative Sketch</h1>
        <p>Interactive Generative Art Prototype</p>
      </header>
      
      <main className="app-main">
        <div className="sketch-container">
          <div className="sketch-canvas">
            <P5Sketch 
              ref={sketchRef}
              colorPalette={colorPalette}
              motionSpeed={motionSpeed}
              patternDensity={patternDensity}
            />
          </div>
          
          <div className="controls-panel">
            <h3>Controls</h3>
            
            <div className="control-group">
              <label>Color Palette</label>
              <select 
                value={colorPalette} 
                onChange={(e) => setColorPalette(e.target.value)}
                className="control-input"
              >
                <option value="warm">Warm</option>
                <option value="cool">Cool</option>
                <option value="nature">Nature</option>
                <option value="monochrome">Monochrome</option>
              </select>
            </div>
            
            <div className="control-group">
              <label>Motion Speed: {motionSpeed.toFixed(1)}</label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={motionSpeed}
                onChange={(e) => setMotionSpeed(parseFloat(e.target.value))}
                className="control-input"
              />
            </div>
            
            <div className="control-group">
              <label>Pattern Density: {patternDensity}</label>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={patternDensity}
                onChange={(e) => setPatternDensity(parseInt(e.target.value))}
                className="control-input"
              />
            </div>
            
            <button className="export-btn" onClick={handleExport}>
              Export Image
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
