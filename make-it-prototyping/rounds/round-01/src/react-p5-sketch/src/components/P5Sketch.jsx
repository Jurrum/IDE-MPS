import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import p5 from 'p5'

const P5Sketch = forwardRef(({ colorPalette = 'warm', motionSpeed = 1, patternDensity = 50 }, ref) => {
  const sketchRef = useRef()
  const p5Instance = useRef(null)
  const isInitialized = useRef(false)
  const paramsRef = useRef({ colorPalette, motionSpeed, patternDensity })

  // Update params whenever props change
  useEffect(() => {
    paramsRef.current = { colorPalette, motionSpeed, patternDensity }
  }, [colorPalette, motionSpeed, patternDensity])

  // Expose export function to parent component
  useImperativeHandle(ref, () => ({
    exportImage: () => {
      if (p5Instance.current) {
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
        p5Instance.current.save(`creative-sketch-${timestamp}.png`)
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
        particles = []
        const currentPalette = palettes[palette] || palettes.warm
        
        for (let i = 0; i < density; i++) {
          particles.push({
            x: p.random(p.width),
            y: p.random(p.height),
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
        initializeParticles()
      }

      p.draw = () => {
        const { colorPalette: palette, motionSpeed: speed, patternDensity: density } = paramsRef.current

        // Dynamic background with subtle gradient
        for (let i = 0; i <= p.height; i++) {
          const inter = p.map(i, 0, p.height, 0, 1)
          const c = p.lerpColor(p.color(20, 25, 35), p.color(5, 10, 20), inter)
          p.stroke(c)
          p.line(0, i, p.width, i)
        }

        time += 0.01 * speed

        // Update particle count if density changed
        if (particles.length !== density) {
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
          // Physics update
          particle.x += particle.vx * speed
          particle.y += particle.vy * speed
          particle.angle += 0.02 * speed

          // Wrap around screen
          if (particle.x < 0) particle.x = p.width
          if (particle.x > p.width) particle.x = 0
          if (particle.y < 0) particle.y = p.height
          if (particle.y > p.height) particle.y = 0

          // Draw particle with glow effect
          p.push()
          p.translate(particle.x, particle.y)
          p.rotate(particle.angle)
          
          // Glow effect
          p.drawingContext.shadowColor = particle.color
          p.drawingContext.shadowBlur = 15
          
          p.fill(particle.color)
          p.noStroke()
          
          // Dynamic shape based on time
          const morphFactor = p.sin(time + index * 0.1)
          const size = particle.size * (1 + morphFactor * 0.3)
          
          // Draw flowing shape
          p.beginShape()
          for (let a = 0; a < p.TWO_PI; a += p.PI / 6) {
            const r = size * (1 + p.sin(a * 3 + time) * 0.2)
            const x = r * p.cos(a)
            const y = r * p.sin(a)
            p.vertex(x, y)
          }
          p.endShape(p.CLOSE)
          
          p.pop()

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
        // Redistribute particles to new canvas size
        particles.forEach(particle => {
          if (particle.x > p.width) particle.x = p.random(p.width)
          if (particle.y > p.height) particle.y = p.random(p.height)
        })
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