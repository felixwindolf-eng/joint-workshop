import React from 'react'
import type { Page } from '@/payload-types'
import { Model3DViewer } from '@/components/Model3DViewer'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getServerSideURL } from '@/utilities/getURL'

type Models3DHeroProps = Page['hero'] & {
  model3dId?: string | { id: string }
}

export const Models3DHero: React.FC<Models3DHeroProps> = async ({ model3dId }) => {
  if (!model3dId) {
    return (
      <div style={{ width: '100%', height: '100vh', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>No 3D model selected</p>
      </div>
    )
  }

  try {
    const payload = await getPayload({ config: configPromise })
    
    // Extract ID from string or object
    const id = typeof model3dId === 'object' ? model3dId?.id : model3dId

    if (!id) {
      return (
        <div style={{ width: '100%', height: '100vh', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Invalid model ID</p>
        </div>
      )
    }

    const model = await payload.findByID({
      collection: '3d-models',
      id,
      depth: 0,
    })

    if (!model || !model.file) {
      return (
        <div style={{ width: '100%', height: '100vh', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Model not found or has no file</p>
        </div>
      )
    }

    let fileUrl = typeof model.file === 'object' ? (model.file.url || '') : (model.file || '')
    
    // Make absolute URL if needed
    if (fileUrl && !fileUrl.startsWith('http')) {
      const serverUrl = getServerSideURL()
      fileUrl = `${serverUrl}${fileUrl}`
    }

    return <Model3DViewer fileUrl={fileUrl} fileName={model.name} />
  } catch (error) {
    console.error('Error loading 3D model:', error)
    return (
      <div style={{ width: '100%', height: '100vh', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Error loading 3D model: {(error as Error).message}</p>
      </div>
    )
  }
}
