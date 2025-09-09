import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import p5 from 'p5'

const P5Sketch = forwardRef(({ 
  colorPalette = 'warm', 
  motionSpeed = 1, 
  patternDensity = 50,
  particleShape = 'circle',
  movementPattern = 'linear',
  showTrails = true
}, ref) => {
  const sketchRef = useRef()
  const p5Instance = useRef(null)
  const isInitialized = useRef(false)
  const trailGraphicsRef = useRef(null)
  const paramsRef = useRef({ colorPalette, motionSpeed, patternDensity, particleShape, movementPattern, showTrails })

  // Update params whenever props change
  useEffect(() => {
    paramsRef.current = { colorPalette, motionSpeed, patternDensity, particleShape, movementPattern, showTrails }
  }, [colorPalette, motionSpeed, patternDensity, particleShape, movementPattern, showTrails])

  // Expose export function to parent component
  useImperativeHandle(ref, () => ({
    exportImage: () => {
      if (p5Instance.current) {
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
        p5Instance.current.save(`creative-sketch-${timestamp}.png`)
      }
    },
    clearTrails: () => {
      if (trailGraphicsRef.current) {
        trailGraphicsRef.current.clear()
      }
    }
  }))

  useEffect(() => {
    const container = sketchRef.current
    
    // Guard against multiple initializations
    if (!container || isInitialized.current || p5Instance.current) {
      return
    }

    // Clear any existing canvases
    container.innerHTML = ''
    
    // Remove any existing global p5 canvases with the same ID
    const existingCanvases = document.querySelectorAll('#defaultCanvas0')
    existingCanvases.forEach(canvas => {
      if (canvas.parentElement !== container) {
        canvas.remove()
      }
    })

    const sketch = (p) => {
      let particles = []
      let time = 0
      let trailGraphics // Persistent graphics buffer for trails

      // Color palettes
      const palettes = {
        warm: ['#FF6B6B', '#FFE66D', '#FF8E53', '#FF6B9D', '#C44569'],
        cool: ['#74B9FF', '#0984E3', '#6C5CE7', '#A29BFE', '#FD79A8'],
        nature: ['#00B894', '#00CEC9', '#55A3FF', '#FDCB6E', '#6C5CE7'],
        monochrome: ['#2D3436', '#636E72', '#B2BEC3', '#DDD', '#74B9FF']
      }

      const getCanvasSize = () => {
        const rect = container.getBoundingClientRect()
        return {
          width: Math.max(300, rect.width - 20), // Minimal margin
          height: Math.max(300, rect.height - 20) // Use actual container height
        }
      }

      const initializeParticles = () => {
        const { colorPalette: palette, patternDensity: density } = paramsRef.current
        const actualDensity = density !== null ? density : 50
        particles = []
        const currentPalette = palettes[palette] || palettes.warm
        
        for (let i = 0; i < actualDensity; i++) {
          particles.push({
            x: p.random(p.width),
            y: p.random(p.height),
            prevX: p.random(p.width), // Store previous position for trails
            prevY: p.random(p.height),
            vx: p.random(-2, 2),
            vy: p.random(-2, 2),
            size: p.random(3, 15),
            color: p.random(currentPalette),
            angle: p.random(p.TWO_PI)
          })
        }
      }

      p.setup = () => {
        const { width, height } = getCanvasSize()
        const canvas = p.createCanvas(width, height)
        canvas.parent(container)
        // Give it a unique ID to avoid conflicts
        canvas.id(`p5-canvas-${Date.now()}`)
        
        // Create persistent graphics buffer for trails
        trailGraphics = p.createGraphics(width, height)
        trailGraphics.clear() // Start with transparent background
        trailGraphicsRef.current = trailGraphics
        
        initializeParticles()
      }

      p.draw = () => {
        const { 
          colorPalette: palette, 
          motionSpeed: speed, 
          patternDensity: density,
          particleShape: shape,
          movementPattern: pattern,
          showTrails: trails
        } = paramsRef.current
        
        // Use default values if parameters are null (empty input)
        const actualSpeed = speed !== null ? speed : 1
        const actualDensity = density !== null ? density : 50

        // Clear main canvas
        p.clear()
        
        // Draw accumulated trails if enabled
        if (trails) {
          p.image(trailGraphics, 0, 0)
        }

        time += 0.01 * actualSpeed

        // Update particle count if density changed
        if (particles.length !== actualDensity) {
          initializeParticles()
        }

        // Update particle colors if palette changed
        const currentPalette = palettes[palette] || palettes.warm
        particles.forEach(particle => {
          if (!currentPalette.includes(particle.color)) {
            particle.color = p.random(currentPalette)
          }
        })

        // Update and draw particles
        particles.forEach((particle, index) => {
          // Store current position as previous
          particle.prevX = particle.x
          particle.prevY = particle.y
          
          // Apply movement pattern based on selected pattern
          if (pattern === 'linear' || !pattern) {
            // Original linear movement
            particle.x += particle.vx * actualSpeed
            particle.y += particle.vy * actualSpeed
          } else {
            // Apply specific movement pattern - completely override linear movement
            const movement = getMovementOffset(pattern, time, particle, index, actualSpeed, p)
            particle.x = movement.x
            particle.y = movement.y
          }
          
          particle.angle += 0.02 * actualSpeed

          // Check if particle needs to wrap around screen
          let wrappedX = particle.x
          let wrappedY = particle.y
          let wrapped = false

          if (particle.x < 0) {
            wrappedX = p.width
            wrapped = true
          }
          if (particle.x > p.width) {
            wrappedX = 0
            wrapped = true
          }
          if (particle.y < 0) {
            wrappedY = p.height
            wrapped = true
          }
          if (particle.y > p.height) {
            wrappedY = 0
            wrapped = true
          }

          // Draw trail line only if particle didn't wrap around edges
          if (trails && !wrapped) {
            // Calculate distance to prevent long lines across screen
            const distance = p.dist(particle.prevX, particle.prevY, particle.x, particle.y)
            // Only draw trail if distance is reasonable (not wrapping around)
            if (distance < p.width * 0.5 && distance < p.height * 0.5) {
              trailGraphics.stroke(particle.color)
              trailGraphics.strokeWeight(2)
              trailGraphics.line(particle.prevX, particle.prevY, particle.x, particle.y)
            }
          }

          // Apply wrapping
          particle.x = wrappedX
          particle.y = wrappedY

          // Draw particle with chosen shape on main canvas
          drawParticleShape(p, particle, shape, time, index)

          // Connect nearby particles with lines
          particles.slice(index + 1).forEach(otherParticle => {
            const distance = p.dist(particle.x, particle.y, otherParticle.x, otherParticle.y)
            if (distance < 100) {
              p.stroke(particle.color + '20')
              p.strokeWeight(0.5)
              p.line(particle.x, particle.y, otherParticle.x, otherParticle.y)
            }
          })
        })
      }

      // Handle window resize
      p.windowResized = () => {
        const { width, height } = getCanvasSize()
        p.resizeCanvas(width, height)
        
        // Recreate trail graphics buffer with new size
        trailGraphics = p.createGraphics(width, height)
        trailGraphics.clear()
        trailGraphicsRef.current = trailGraphics
        
        // Redistribute particles to new canvas size
        particles.forEach(particle => {
          if (particle.x > p.width) particle.x = p.random(p.width)
          if (particle.y > p.height) particle.y = p.random(p.height)
        })
      }

      // Movement pattern functions - return absolute positions
      const getMovementOffset = (pattern, time, particle, index, speed, p) => {
        const centerX = p.width / 2
        const centerY = p.height / 2
        const radius = 100 + index * 10 // Different radius for each particle
        const timeOffset = index * 0.2 // Phase offset for each particle
        
        switch (pattern) {
          case 'sine':
            const sineX = centerX + p.sin(time + timeOffset) * radius
            const sineY = centerY + p.sin(time * 0.7 + timeOffset) * radius * 0.5
            return { x: sineX, y: sineY }
            
          case 'circular':
            const circleAngle = time * speed * 0.5 + timeOffset
            const circX = centerX + p.cos(circleAngle) * radius
            const circY = centerY + p.sin(circleAngle) * radius
            return { x: circX, y: circY }
            
          case 'spiral':
            const spiralAngle = time * speed * 0.3 + timeOffset
            const spiralRadius = (time * speed * 2 + index * 5) % 150 + 50
            const spirX = centerX + p.cos(spiralAngle) * spiralRadius
            const spirY = centerY + p.sin(spiralAngle) * spiralRadius
            return { x: spirX, y: spirY }
            
          case 'bouncing':
            const bounceX = centerX + p.sin(time * speed + timeOffset) * radius
            const bounceY = centerY + Math.abs(p.sin(time * speed * 2 + timeOffset)) * radius - radius/2
            return { x: bounceX, y: bounceY }
            
          case 'chaotic':
            const noiseX = p.noise(time * 0.01 + index * 0.1) * p.width
            const noiseY = p.noise(time * 0.01 + index * 0.1 + 1000) * p.height
            return { x: noiseX, y: noiseY }
            
          default: // linear - should not reach here
            return { 
              x: particle.x + particle.vx * speed, 
              y: particle.y + particle.vy * speed 
            }
        }
      }

      // Shape drawing functions
      const drawParticleShape = (p, particle, shape, time, index) => {
        p.push()
        p.translate(particle.x, particle.y)
        p.rotate(particle.angle)
        
        // Glow effect
        p.drawingContext.shadowColor = particle.color
        p.drawingContext.shadowBlur = 15
        
        p.fill(particle.color)
        p.noStroke()
        
        // Dynamic size based on time
        const morphFactor = p.sin(time + index * 0.1)
        const size = particle.size * (1 + morphFactor * 0.3)
        
        switch (shape) {
          case 'circle':
            p.ellipse(0, 0, size * 2, size * 2)
            break
            
          case 'square':
            p.rectMode(p.CENTER)
            p.rect(0, 0, size * 1.5, size * 1.5)
            break
            
          case 'triangle':
            p.beginShape()
            for (let a = 0; a < p.TWO_PI; a += p.TWO_PI / 3) {
              const x = size * p.cos(a)
              const y = size * p.sin(a)
              p.vertex(x, y)
            }
            p.endShape(p.CLOSE)
            break
            
          case 'star':
            p.beginShape()
            for (let a = 0; a < p.TWO_PI; a += p.PI / 5) {
              const outerRadius = size
              const innerRadius = size * 0.5
              const radius = (a % (p.PI / 2.5)) === 0 ? outerRadius : innerRadius
              const x = radius * p.cos(a)
              const y = radius * p.sin(a)
              p.vertex(x, y)
            }
            p.endShape(p.CLOSE)
            break
            
          case 'hexagon':
            p.beginShape()
            for (let a = 0; a < p.TWO_PI; a += p.TWO_PI / 6) {
              const x = size * p.cos(a)
              const y = size * p.sin(a)
              p.vertex(x, y)
            }
            p.endShape(p.CLOSE)
            break
            
          case 'morphing':
          default:
            // Original morphing shape
            p.beginShape()
            for (let a = 0; a < p.TWO_PI; a += p.PI / 6) {
              const r = size * (1 + p.sin(a * 3 + time) * 0.2)
              const x = r * p.cos(a)
              const y = r * p.sin(a)
              p.vertex(x, y)
            }
            p.endShape(p.CLOSE)
            break
        }
        
        p.pop()
      }
    }

    try {
      // Create p5 instance
      p5Instance.current = new p5(sketch)
      isInitialized.current = true
    } catch (error) {
      console.error('Error creating p5 instance:', error)
    }

    // Cleanup function
    return () => {
      if (p5Instance.current) {
        try {
          p5Instance.current.remove()
        } catch (error) {
          console.error('Error removing p5 instance:', error)
        }
        p5Instance.current = null
      }
      isInitialized.current = false
      
      // Clear container
      if (container) {
        container.innerHTML = ''
      }
    }
  }, []) // Empty dependency array - only run once

  return (
    <div 
      ref={sketchRef} 
      className="p5-container"
    />
  )
})

export default P5Sketch