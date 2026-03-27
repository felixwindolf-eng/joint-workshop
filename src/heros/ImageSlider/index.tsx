'use client'

import React, { useRef, useEffect } from 'react'
import Image from 'next/image'
import type { Page } from '@/payload-types'

type ImageSliderHeroProps = Page['hero'] & {
  sliderImages?: Array<{
    image?: {
      id: string
      alt?: string
      url?: string
      width?: number
      height?: number
    }
  }>
}

export const ImageSliderHero: React.FC<ImageSliderHeroProps> = ({ sliderImages = [] }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const validImages = sliderImages.filter((item) => item.image?.url)

  // Auto-scroll for desktop (show 3 images)
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container || !validImages.length) return

    let scrollAmount = 0
    const scrollInterval = setInterval(() => {
      scrollAmount += 1
      container.scrollLeft += scrollAmount * 0.5
    }, 20)

    return () => clearInterval(scrollInterval)
  }, [validImages.length])

  if (!validImages.length) {
    return null
  }

  return (
    <div
      className="w-full min-h-screen bg-white"
      style={{
        backgroundImage:
          'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)',
        backgroundSize: '50px 50px',
      }}
    >
      {/* Desktop slider (3 images visible) */}
      <div className="hidden md:block h-screen overflow-x-auto overflow-y-hidden" ref={scrollContainerRef}>
        <div className="flex h-full gap-0">
          {validImages.map((item, idx) => {
            const imageUrl = item.image?.url
            return (
              <div key={`${item.image?.id}-${idx}`} className="flex-shrink-0 w-screen h-screen">
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={item.image?.alt || `Slider image ${idx + 1}`}
                    fill
                    className="object-cover"
                    priority={idx === 0}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Mobile slider (1 image, swipeable) */}
      <div className="md:hidden h-screen overflow-x-auto overflow-y-hidden snap-x snap-mandatory" ref={scrollContainerRef}>
        <div className="flex h-full gap-0">
          {validImages.map((item, idx) => {
            const imageUrl = item.image?.url
            return (
              <div
                key={`mobile-${item.image?.id}-${idx}`}
                className="flex-shrink-0 w-screen h-screen snap-start"
              >
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={item.image?.alt || `Slider image ${idx + 1}`}
                    fill
                    className="object-cover"
                    priority={idx === 0}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
