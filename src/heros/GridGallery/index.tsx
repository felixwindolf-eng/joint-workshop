'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { Page } from '@/payload-types'

type GridGalleryHeroProps = Page['hero'] & {
  galleryImages?: Array<{
    image?: {
      id: string
      alt?: string
      url?: string
      width?: number
      height?: number
    }
  }>
}

export const GridGalleryHero: React.FC<GridGalleryHeroProps> = ({ galleryImages = [] }) => {
  const validImages = galleryImages.filter((item) => {
    const image = item.image
    return typeof image === 'object' && image?.url
  })
  
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [slideWidth, setSlideWidth] = useState<number>(0)

  useEffect(() => {
    const updateSlideWidth = () => {
      const wrapper = wrapperRef.current
      if (!wrapper) return
      
      const computedGap = window.getComputedStyle(wrapper).gap
      const gap = computedGap === 'normal' ? 20 : parseFloat(computedGap)
      const computedPadding = window.getComputedStyle(wrapper).paddingLeft
      const padding = parseFloat(computedPadding) || 0
      const viewportWidth = wrapper.clientWidth
      // 2 slides + 1 gap + 2 padding = viewportWidth
      const width = (viewportWidth - 2 * padding - gap) / 2
      setSlideWidth(width)
    }

    updateSlideWidth()
    window.addEventListener('resize', updateSlideWidth)
    return () => window.removeEventListener('resize', updateSlideWidth)
  }, [])

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()
        
        // Calculate viewport width minus padding
        const computedGap = window.getComputedStyle(wrapper).gap
        const gap = computedGap === 'normal' ? 20 : parseFloat(computedGap)
        const computedPadding = window.getComputedStyle(wrapper).paddingLeft
        const padding = parseFloat(computedPadding) || 0
        const viewportWidth = wrapper.clientWidth
        
        // Calculate single slide width: (viewportWidth - 2*padding - gap) / 2
        const slideWidth = (viewportWidth - 2 * padding - gap) / 2
        const scrollAmount = slideWidth + gap
        
        if (e.deltaY > 0) {
          wrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' })
        } else {
          wrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
        }
      }
    }

    wrapper.addEventListener('wheel', handleWheel, { passive: false })
    return () => wrapper.removeEventListener('wheel', handleWheel)
  }, [])

  if (!validImages.length) {
    return null
  }

  return (
    <>
      <style>{`
        .gallery-container {
          height: 100vh;
          background-color: white;
          padding-top: calc(40vh - 25vh);
          padding-bottom: calc(60vh - 25vh);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gallery-inner {
          width: 70vw;
          justify-content: center;
          height: 90vh;
          display: flex;
          align-items: center;
        }

        .gallery-wrapper {
          display: flex;
          height: 100%;
          width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          //gap: max(20px, 5vw);
          //padding-left: max(20px, 5vw);
          //padding-right: max(20px, 5vw);
          box-sizing: border-box;
          align-items: center;
          scroll-behavior: smooth;
          scroll-snap-type: x mandatory;
        }

        .gallery-wrapper::-webkit-scrollbar {
          display: none;
        }

        .gallery-slide {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          scroll-snap-align: start;
        }
      `}</style>

      <div className="gallery-container">
        <div className="gallery-inner">
          <div className="gallery-wrapper" ref={wrapperRef}>
          {validImages.map((item, idx) => {
            const image = item.image as any
            const imageUrl = image?.url
            const imageHeight = image?.height
            const imageId = image?.id

            return (
              <div
                key={`${imageId}-${idx}`}
                className="gallery-slide"
                style={{
                  width: slideWidth > 0 ? `${slideWidth}px` : '50%',
                  height: '50vh',
                }}
              >
                <div className="relative overflow-hidden" style={{ width: '100%', height: '100%' }}>
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={image?.alt || `Gallery image ${idx + 1}`}
                      fill
                      className="object-contain"
                      priority={idx === 0}
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
        </div>
      </div>
    </>
  )
}
