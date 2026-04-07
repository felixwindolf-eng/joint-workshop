'use client'

import React, { useEffect, useRef, useState } from 'react'

interface Model3DViewerProps {
  fileUrl: string
  format: 'stl' | 'step' | 'iges'
}

export const Model3DViewer: React.FC<Model3DViewerProps> = ({ fileUrl, format }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!containerRef.current || format !== 'stl') return

    // Dynamic import to avoid Three.js type issues
    const initViewer = async () => {
      try {
        // @ts-ignore - Three.js types don't cover examples
        const THREE = await import('three')
        // @ts-ignore - STLLoader not in types
        const { STLLoader } = await import('three/examples/jsm/loaders/STLLoader')

        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0xffffff)

        const width = containerRef.current!.clientWidth
        const height = containerRef.current!.clientHeight
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
        camera.position.z = 100

        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(width, height)
        renderer.setPixelRatio(window.devicePixelRatio)
        containerRef.current!.appendChild(renderer.domElement)

        const light = new THREE.DirectionalLight(0xffffff, 1)
        light.position.set(10, 10, 10)
        scene.add(light)

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        scene.add(ambientLight)

        const loader = new STLLoader()
        loader.load(fileUrl, (geometry: any) => {
          geometry.computeVertexNormals()
          geometry.center()

          const material = new THREE.MeshPhongMaterial({
            color: 0x156289,
            emissive: 0x072534,
            shininess: 200,
          })
          const mesh = new THREE.Mesh(geometry, material)
          scene.add(mesh)

          const bbox = new THREE.Box3().setFromObject(mesh)
          const size = bbox.getSize(new THREE.Vector3())
          const maxDim = Math.max(size.x, size.y, size.z)
          const fov = camera.fov * (Math.PI / 180)
          let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2))
          cameraZ *= 1.5
          camera.position.z = cameraZ
          camera.lookAt(mesh.position)

          setIsLoading(false)
        })

        const animate = () => {
          requestAnimationFrame(animate)

          scene.children.forEach((child: any) => {
            if (child.isMesh) {
              child.rotation.x += 0.001
              child.rotation.y += 0.002
            }
          })

          renderer.render(scene, camera)
        }
        animate()

        const handleResize = () => {
          if (!containerRef.current) return
          const w = containerRef.current.clientWidth
          const h = containerRef.current.clientHeight
          camera.aspect = w / h
          camera.updateProjectionMatrix()
          renderer.setSize(w, h)
        }

        window.addEventListener('resize', handleResize)

        return () => {
          window.removeEventListener('resize', handleResize)
          renderer.dispose()
          containerRef.current?.removeChild(renderer.domElement)
        }
      } catch (error) {
        console.error('Error loading 3D viewer:', error)
        setHasError(true)
      }
    }

    initViewer()
  }, [fileUrl, format])

  if (hasError) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f0f0f0',
        }}
      >
        <p>Error loading 3D model</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '20px',
            borderRadius: '8px',
            zIndex: 10,
          }}
        >
          Loading 3D model...
        </div>
      )}
    </div>
  )
}
