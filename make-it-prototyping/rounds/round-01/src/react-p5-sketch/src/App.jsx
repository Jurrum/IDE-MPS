import { useState, useRef } from 'react'
import P5Sketch from './components/P5Sketch'
import './App.css'

function App() {
  // Basic controls
  const [colorPalette, setColorPalette] = useState('warm')
  const [motionSpeed, setMotionSpeed] = useState(1)
  const [patternDensity, setPatternDensity] = useState(50)
  const [speedError, setSpeedError] = useState('')
  const [densityError, setDensityError] = useState('')
  
  // New controls
  const [particleShape, setParticleShape] = useState('circle')
  const [movementPattern, setMovementPattern] = useState('linear')
  const [showTrails, setShowTrails] = useState(true)
  
  // Tab system
  const [activeTab, setActiveTab] = useState('basic')
  
  const sketchRef = useRef()

  const handleMotionSpeedChange = (e) => {
    const value = e.target.value
    
    // Allow empty input - set to null and clear errors
    if (value === '') {
      setSpeedError('')
      setMotionSpeed(null)
      return
    }
    
    const numValue = parseFloat(value)
    
    // Allow valid numbers within range
    if (!isNaN(numValue) && numValue >= 0.1 && numValue <= 3) {
      setSpeedError('')
      setMotionSpeed(numValue)
      return
    }
    
    // Show error for invalid input but don't prevent typing
    if (isNaN(numValue)) {
      setSpeedError('Please enter a valid number')
    } else if (numValue < 0.1 || numValue > 3) {
      setSpeedError('Speed must be between 0.1 and 3.0')
    }
  }

  const handlePatternDensityChange = (e) => {
    const value = e.target.value
    
    // Allow empty input - set to null and clear errors
    if (value === '') {
      setDensityError('')
      setPatternDensity(null)
      return
    }
    
    const numValue = parseInt(value)
    
    // Allow valid numbers within range
    if (!isNaN(numValue) && numValue >= 10 && numValue <= 100) {
      setDensityError('')
      setPatternDensity(numValue)
      return
    }
    
    // Show error for invalid input but don't prevent typing
    if (isNaN(numValue)) {
      setDensityError('Please enter a valid number')
    } else if (numValue < 10 || numValue > 100) {
      setDensityError('Density must be between 10 and 100')
    }
  }

  const handleExport = () => {
    if (sketchRef.current && sketchRef.current.exportImage) {
      sketchRef.current.exportImage()
    }
  }

  const handleClearTrails = () => {
    if (sketchRef.current && sketchRef.current.clearTrails) {
      sketchRef.current.clearTrails()
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
              particleShape={particleShape}
              movementPattern={movementPattern}
              showTrails={showTrails}
            />
          </div>
          
          <div className="controls-panel">
            <h3>Controls</h3>
            
            {/* Tab Navigation */}
            <div className="tab-nav">
              <button 
                className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
                onClick={() => setActiveTab('basic')}
              >
                Basic
              </button>
              <button 
                className={`tab-btn ${activeTab === 'appearance' ? 'active' : ''}`}
                onClick={() => setActiveTab('appearance')}
              >
                Appearance
              </button>
              <button 
                className={`tab-btn ${activeTab === 'movement' ? 'active' : ''}`}
                onClick={() => setActiveTab('movement')}
              >
                Movement
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="tab-content">
              
              {/* Basic Tab */}
              {activeTab === 'basic' && (
                <>
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
                    <label>Motion Speed (0.1 - 3.0)</label>
                    <input
                      type="number"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={motionSpeed === null ? '' : motionSpeed}
                      onChange={handleMotionSpeedChange}
                      className={`control-input ${speedError ? 'error' : ''}`}
                      placeholder="Enter speed (0.1 - 3.0)"
                    />
                    {speedError && <div className="error-message">{speedError}</div>}
                  </div>
                  
                  <div className="control-group">
                    <label>Pattern Density (10 - 100)</label>
                    <input
                      type="number"
                      min="10"
                      max="100"
                      step="1"
                      value={patternDensity === null ? '' : patternDensity}
                      onChange={handlePatternDensityChange}
                      className={`control-input ${densityError ? 'error' : ''}`}
                      placeholder="Enter density (10 - 100)"
                    />
                    {densityError && <div className="error-message">{densityError}</div>}
                  </div>
                </>
              )}
              
              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <>
                  <div className="control-group">
                    <label>Particle Shape</label>
                    <select 
                      value={particleShape} 
                      onChange={(e) => setParticleShape(e.target.value)}
                      className="control-input"
                    >
                      <option value="circle">Circle</option>
                      <option value="square">Square</option>
                      <option value="triangle">Triangle</option>
                      <option value="star">Star</option>
                      <option value="hexagon">Hexagon</option>
                      <option value="morphing">Morphing</option>
                    </select>
                  </div>
                  
                  <div className="control-group">
                    <label>Size Variation</label>
                    <select 
                      className="control-input"
                      defaultValue="normal"
                    >
                      <option value="small">Small (3-8)</option>
                      <option value="normal">Normal (3-15)</option>
                      <option value="large">Large (8-25)</option>
                      <option value="mixed">Mixed Sizes</option>
                    </select>
                  </div>
                </>
              )}
              
              {/* Movement Tab */}
              {activeTab === 'movement' && (
                <>
                  <div className="control-group">
                    <label>Movement Pattern</label>
                    <select 
                      value={movementPattern} 
                      onChange={(e) => setMovementPattern(e.target.value)}
                      className="control-input"
                    >
                      <option value="linear">Linear</option>
                      <option value="sine">Sine Wave</option>
                      <option value="circular">Circular</option>
                      <option value="spiral">Spiral</option>
                      <option value="bouncing">Bouncing</option>
                      <option value="chaotic">Chaotic</option>
                    </select>
                  </div>
                  
                  <div className="control-group">
                    <label>Path Strength</label>
                    <input
                      type="number"
                      min="0.1"
                      max="2"
                      step="0.1"
                      defaultValue="1"
                      className="control-input"
                      placeholder="Enter strength (0.1 - 2.0)"
                    />
                  </div>
                  
                  <div className="control-group">
                    <label>Rotation Speed</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      defaultValue="1"
                      className="control-input"
                      placeholder="Enter rotation (0 - 5.0)"
                    />
                  </div>
                  
                  <div className="control-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={showTrails}
                        onChange={(e) => setShowTrails(e.target.checked)}
                        style={{ marginRight: '0.5rem' }}
                      />
                      Show Trails
                    </label>
                  </div>
                  
                  <div className="control-group">
                    <button 
                      onClick={handleClearTrails}
                      className="control-btn"
                    >
                      Clear Trails
                    </button>
                  </div>
                </>
              )}
            </div>
            
            {/* Export Button - always visible */}
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
