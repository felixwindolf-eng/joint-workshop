'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
  }, [pathname, setHeaderTheme])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
  }, [headerTheme, theme])

  return (
    <header 
      className="w-full fixed top-0 left-0 z-50 bg-transparent border-transparent pointer-events-none"
      style={{
        padding: '20px 20px 20px 20px',
        fontSize: '20px',
        boxSizing: 'border-box',
      }}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="nav flex justify-between items-center w-full gap-0" style={{ pointerEvents: 'auto' }}>
        <Link 
          href="/" 
          className="logo text-left text-black no-underline"
          style={{
            whiteSpace: 'nowrap',
            fontSize: '14px',
          }}
        >
          <span style={{ position: 'relative', display: 'inline-block' }}>
            {/* Hidden glow effect - uncomment to show
            <span
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120px',
                height: '35px',
                background: 'radial-gradient(ellipse at center, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0) 70%)',
                borderRadius: '50%',
                pointerEvents: 'none',
              }}
            />
            */}
            <span style={{ position: 'relative', zIndex: 1 }}>JOINT WORKSHOP</span>
          </span>
        </Link>
        <Link 
          href="/posts" 
          className="read-some text-right text-black no-underline"
          style={{
            whiteSpace: 'nowrap',
            fontSize: '14px',
          }}
        >
          <span style={{ position: 'relative', display: 'inline-block' }}>
            {/* Hidden glow effect - uncomment to show
            <span
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100px',
                height: '35px',
                background: 'radial-gradient(ellipse at center, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0) 70%)',
                borderRadius: '50%',
                pointerEvents: 'none',
              }}
            />
            */}
            <span style={{ position: 'relative', zIndex: 1 }}>READ SOME</span>
          </span>
        </Link>
      </div>
    </header>
  )
}
