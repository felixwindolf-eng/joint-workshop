'use client'

import { useEffect, useState, useRef } from 'react'

export function LaggyCursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const ghostsRef = useRef<{ x: number; y: number }[]>(
    Array(10).fill({ x: 0, y: 0 })
  )
  const [ghosts, setGhosts] = useState(ghostsRef.current)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    let animationId: number

    const animate = () => {
      ghostsRef.current = ghostsRef.current.map((ghost, i) => {
        const target = i === 0 ? mousePos : ghostsRef.current[i - 1]
        const delay = 0.4 // Hur "laggig" den är (lägre = laggigare)
        return {
          x: ghost.x + (target.x - ghost.x) * delay,
          y: ghost.y + (target.y - ghost.y) * delay,
        }
      })
      setGhosts([...ghostsRef.current])
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [mousePos])

  return (
    <>
      <style>{`
        * {
          cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='6' height='6'><circle cx='3' cy='3' r='3' fill='black'/></svg>") 3 3, auto !important;
        }
      `}</style>
      {ghosts.map((ghost, i) => (
        <div
          key={i}
          style={{
            position: 'fixed',
            left: ghost.x,
            top: ghost.y,
            width: 6 - i * 0.3,
            height: 6 - i * 0.3,
            backgroundColor: '#000',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 99999,
            transform: 'translate(-50%, -50%)',
            opacity: 1 - i * 0.1,
          }}
        />
      ))}
    </>
  )
}
