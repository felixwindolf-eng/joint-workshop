import React from 'react'
import type { Page } from '@/payload-types'
import { Model3DViewer } from '@/components/Model3DViewer'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

type Models3DHeroProps = Page['hero'] & {
  model3dId?: string
}

export const Models3DHero: React.FC<Models3DHeroProps> = async ({ model3dId }) => {
  let modelFile = null

  if (model3dId) {
    const payload = await getPayload({ config: configPromise })
    try {
      const model = await payload.findByID({
        collection: '3d-models',
        id: model3dId as string,
        depth: 1,
      })

      if (model && model.file && typeof model.file === 'object') {
        modelFile = {
          url: model.file.url,
          format: model.format as 'stl' | 'step' | 'iges',
        }
      }
    } catch (error) {
      console.error('Error loading 3D model:', error)
    }
  }

  if (!modelFile) {
    return (
      <div
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#ffffff',
        }}
      >
        <p>No 3D model loaded</p>
      </div>
    )
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        background: '#ffffff',
      }}
    >
      <Model3DViewer fileUrl={modelFile.url} format={modelFile.format} />
    </div>
  )
}
