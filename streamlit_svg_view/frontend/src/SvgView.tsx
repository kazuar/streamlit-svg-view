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
        setAnimationState(isPlaying)
      }
    }
  }

  const setAnimationState = (playing: boolean) => {
    if (!svgElementRef.current) return

    const animations = svgElementRef.current.querySelectorAll('animate, animateTransform, animateMotion')
    
    animations.forEach((anim: Element) => {
      const animElement = anim as SVGAnimationElement
      if (playing) {
        try {
          animElement.beginElement()
        } catch (e) {
          // If beginElement fails, the animation might already be running
        }
      } else {
        try {
          animElement.endElement()
        } catch (e) {
          // If endElement fails, try pausing instead
          if ('pauseAnimations' in svgElementRef.current!) {
            (svgElementRef.current as any).pauseAnimations()
          }
        }
      }
    })

    // For SVG elements that support pauseAnimations/unpauseAnimations
    if (svgElementRef.current) {
      try {
        if (playing && 'unpauseAnimations' in svgElementRef.current) {
          (svgElementRef.current as any).unpauseAnimations()
        } else if (!playing && 'pauseAnimations' in svgElementRef.current) {
          (svgElementRef.current as any).pauseAnimations()
        }
      } catch (e) {
        // Fallback for browsers that don't support these methods
      }
    }
  }

  const restartAnimations = () => {
    if (!svgElementRef.current) return

    const animations = svgElementRef.current.querySelectorAll('animate, animateTransform, animateMotion')
    
    animations.forEach((anim: Element) => {
      const animElement = anim as SVGAnimationElement
      try {
        animElement.endElement()
        setTimeout(() => {
          animElement.beginElement()
        }, 10)
      } catch (e) {
        // Fallback: try to restart by manipulating the animation
        const beginValue = animElement.getAttribute('begin')
        if (beginValue) {
          animElement.setAttribute('begin', beginValue)
        }
      }
    })

    // For SVG root element restart
    if (svgElementRef.current && 'setCurrentTime' in svgElementRef.current) {
      try {
        (svgElementRef.current as any).setCurrentTime(0)
      } catch (e) {
        // Browser doesn't support setCurrentTime
      }
    }
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
    setAnimationState(newPlayingState)
    Streamlit.setComponentValue({
      is_playing: newPlayingState,
      action: newPlayingState ? 'play' : 'pause'
    })
  }

  const handleRestart = () => {
    setIsPlaying(true)
    restartAnimations()
    Streamlit.setComponentValue({
      is_playing: true,
      action: 'restart'
    })
  }

  useEffect(() => {
    setupSvgElement()
    updateStreamlit()
  }, [svg_content, isPlaying])

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