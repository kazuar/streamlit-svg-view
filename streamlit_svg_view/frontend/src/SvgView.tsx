import React, { useEffect, useRef, useState } from 'react'
import { withStreamlitConnection, ComponentProps, Streamlit } from 'streamlit-component-lib'

interface Args {
  svg_content: string
  width?: number
  height?: number
  play_color?: string
  pause_color?: string
  restart_color?: string
}

function SvgView(props: ComponentProps) {
  const { args } = props
  const { 
    svg_content, 
    width = 400, 
    height = 300,
    play_color,
    pause_color,
    restart_color
  } = args as Args
  
  // Set default colors if not provided
  const actualPlayColor = play_color || 'rgba(52,199,89,0.8)'
  const actualPauseColor = pause_color || 'rgba(255,149,0,0.8)'
  const actualRestartColor = restart_color || 'rgba(88,86,214,0.8)'
  
  const [isPlaying, setIsPlaying] = useState(true)
  const [isHovering, setIsHovering] = useState(false)
  const svgRef = useRef<HTMLDivElement>(null)
  const svgElementRef = useRef<SVGElement | null>(null)

  const setupSvgElement = () => {
    if (svgRef.current) {
      svgElementRef.current = svgRef.current.querySelector('svg')
      if (svgElementRef.current) {
        // Start animations by default but respect the current state
        setTimeout(() => {
          // Small delay to ensure SVG is fully rendered
          if (svgElementRef.current) {
            // Ensure animations are initially running
            const animations = svgElementRef.current.querySelectorAll('animate, animateTransform, animateMotion')
            animations.forEach((anim: Element) => {
              const animElement = anim as SVGAnimationElement
              try {
                animElement.beginElement()
              } catch (e) {
                // Animation might already be auto-started
              }
            })
            
            // Apply the current play state
            if (!isPlaying) {
              setAnimationState(false)
            }
          }
        }, 100)
      }
    }
  }

  const setAnimationState = (playing: boolean) => {
    if (!svgElementRef.current) return

    // The key insight: SVG SMIL animations need different handling than CSS animations
    console.log(`Setting animation state to: ${playing ? 'playing' : 'paused'}`)

    if (playing) {
      // Method 1: Try SVG unpause first
      try {
        if (typeof (svgElementRef.current as any).unpauseAnimations === 'function') {
          (svgElementRef.current as any).unpauseAnimations()
          console.log('Used SVG unpauseAnimations')
          return
        }
      } catch (e) {
        console.log('SVG unpauseAnimations failed:', e)
      }
      
      // Method 2: Clear any pause styling
      svgElementRef.current.style.animationPlayState = 'running'
      svgElementRef.current.style.visibility = 'visible'
      
    } else {
      // Method 1: Try SVG pause first  
      try {
        if (typeof (svgElementRef.current as any).pauseAnimations === 'function') {
          (svgElementRef.current as any).pauseAnimations()
          console.log('Used SVG pauseAnimations')
          return
        }
      } catch (e) {
        console.log('SVG pauseAnimations failed:', e)
      }
      
      // Method 2: Since SMIL pause doesn't work reliably, show user feedback
      // and inform them that true pause/resume isn't supported
      console.log('SVG pause not fully supported - animations will restart when resumed')
      
      // Visual feedback: temporarily dim the SVG
      svgElementRef.current.style.opacity = '0.5'
      setTimeout(() => {
        if (svgElementRef.current) {
          svgElementRef.current.style.opacity = '1'
        }
      }, 200)
    }
  }

  const restartAnimations = () => {
    if (!svgElementRef.current) return

    // First, ensure animations are unpaused
    if ('unpauseAnimations' in svgElementRef.current) {
      try {
        (svgElementRef.current as any).unpauseAnimations()
      } catch (e) {
        // Ignore
      }
    }

    // Method 1: Use setCurrentTime if available (most reliable)
    if ('setCurrentTime' in svgElementRef.current) {
      try {
        (svgElementRef.current as any).setCurrentTime(0)
        return // Success, no need for fallbacks
      } catch (e) {
        // Continue to fallback methods
      }
    }

    // Method 2: End and restart individual animations
    const animations = svgElementRef.current.querySelectorAll('animate, animateTransform, animateMotion')
    
    animations.forEach((anim: Element) => {
      const animElement = anim as SVGAnimationElement
      try {
        // End current animation
        animElement.endElement()
        // Restart after a brief delay
        setTimeout(() => {
          try {
            animElement.beginElement()
          } catch (e) {
            // Fallback: clone and replace the element to reset it
            const parent = animElement.parentNode
            const newAnim = animElement.cloneNode(true) as SVGAnimationElement
            if (parent) {
              parent.replaceChild(newAnim, animElement)
              setTimeout(() => {
                try {
                  newAnim.beginElement()
                } catch (e) {
                  // Final fallback failed
                }
              }, 10)
            }
          }
        }, 10)
      } catch (e) {
        // If endElement fails, try direct restart
        try {
          animElement.beginElement()
        } catch (e2) {
          // All methods failed for this animation
        }
      }
    })

    // Clear any CSS pause states
    const allElements = svgElementRef.current.querySelectorAll('*')
    allElements.forEach((element: Element) => {
      const el = element as HTMLElement
      if (el.style) {
        el.style.animationPlayState = 'running'
      }
    })
  }

  const updateStreamlit = () => {
    Streamlit.setComponentValue({
      is_playing: isPlaying,
      action: 'state_change'
    })
  }

  const handleTogglePlayPause = () => {
    const newPlayingState = !isPlaying
    setIsPlaying(newPlayingState)
    
    // Apply animation state change without re-rendering SVG
    setTimeout(() => setAnimationState(newPlayingState), 0)
    
    Streamlit.setComponentValue({
      is_playing: newPlayingState,
      action: newPlayingState ? 'play' : 'pause'
    })
  }

  const handleRestart = () => {
    setIsPlaying(true)
    
    // Apply restart without triggering re-render
    setTimeout(() => restartAnimations(), 0)
    
    Streamlit.setComponentValue({
      is_playing: true,
      action: 'restart'
    })
  }

  useEffect(() => {
    setupSvgElement()
    updateStreamlit()
  }, [svg_content]) // Only re-run when SVG content changes, not when play state changes

  useEffect(() => {
    Streamlit.setFrameHeight(height + 20) // Just padding space
  }, [height])

  return (
    <div style={{ padding: '10px' }}>
      <div 
        style={{ 
          position: 'relative',
          width: `${width}px`,
          height: `${height}px`,
          border: '1px solid #ddd',
          borderRadius: '4px',
          overflow: 'hidden',
          backgroundColor: '#f9f9f9'
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div 
          ref={svgRef}
          style={{
            width: '100%',
            height: '100%'
          }}
          dangerouslySetInnerHTML={{ __html: svg_content }}
        />
        
        {/* Overlay controls that appear on hover */}
        <div 
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            display: 'flex',
            gap: '8px',
            opacity: isHovering ? 1 : 0,
            transition: 'opacity 0.2s ease-in-out',
            pointerEvents: isHovering ? 'auto' : 'none',
            zIndex: 10
          }}
        >
          <button 
            onClick={handleTogglePlayPause}
            title={isPlaying ? "Pause" : "Play"}
            style={{
              width: '32px',
              height: '32px',
              padding: '0',
              backgroundColor: isPlaying ? actualPauseColor : actualPlayColor,
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              backdropFilter: 'blur(8px)'
            }}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          
          <button 
            onClick={handleRestart}
            title="Restart"
            style={{
              width: '32px',
              height: '32px',
              padding: '0',
              backgroundColor: actualRestartColor,
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              backdropFilter: 'blur(8px)'
            }}
          >
            ↻
          </button>
        </div>
      </div>
    </div>
  )
}

export default withStreamlitConnection(SvgView)