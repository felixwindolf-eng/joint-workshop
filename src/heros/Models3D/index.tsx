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
    
    // Extract ID from string or object, and filter out undefined/null values
    const id = typeof model3dId === 'object' && model3dId !== null ? model3dId?.id : model3dId
    
    if (!id || typeof id !== 'string') {
      return (
        <div style={{ width: '100%', height: '100vh', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Invalid model ID: {JSON.stringify(id)}</p>
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
    
    if (!fileUrl) {
      return (
        <div style={{ width: '100%', height: '100vh', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Model has no file URL</p>
        </div>
      )
    }
    
    // Make absolute URL if needed
    if (!fileUrl.startsWith('http')) {
      const serverUrl = getServerSideURL()
      // Ensure proper URL formatting
      const baseUrl = serverUrl.endsWith('/') ? serverUrl.slice(0, -1) : serverUrl
      const path = fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`
      fileUrl = `${baseUrl}${path}`
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
