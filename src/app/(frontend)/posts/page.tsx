import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  // Hämta info från globals
  const info = await payload.findGlobal({
    slug: 'info',
  })

  return (
    <>
      <style>{`
        .info-container {
          width: 50vw;
          padding: 80px 10px 20px 20px;
          box-sizing: border-box;
        }
        
        @media (max-width: 768px) {
          .info-container {
            width: 100%;
            padding: 60px 20px 20px 20px;
          }
        }
      `}</style>
      <div className="min-h-screen flex items-center bg-white">
        <div className="info-container">
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#000', lineHeight: '1.4', textAlign: 'left' }}>
            <h1 style={{ fontSize: '14px', fontWeight: 'normal', marginBottom: '24px', color: '#000' }}>
              {info?.title || 'INFO'}
            </h1>
            
            {info?.description && (
              <p style={{ marginBottom: '24px', whiteSpace: 'pre-wrap' }}>
                {info.description}
              </p>
            )}
            
            {info?.contactText && (
              <p style={{ marginBottom: '24px', whiteSpace: 'pre-wrap' }}>
                {info.contactText}
              </p>
            )}
            
            {info?.email && (
              <p style={{ marginBottom: '8px' }}>
                <a href={`mailto:${info.email}`} style={{ color: '#000', textDecoration: 'underline' }}>
                  {info.email}
                </a>
              </p>
            )}
            
            {info?.instagram && info?.instagramUrl && (
              <p style={{ marginBottom: '24px' }}>
                <a href={info.instagramUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#000', textDecoration: 'underline' }}>
                  {info.instagram}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Info - Joint Workshop`,
  }
}
