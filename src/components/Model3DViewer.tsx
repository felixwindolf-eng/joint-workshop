'use client'

import React, { useEffect, useRef } from 'react'

interface Model3DViewerProps {
  fileUrl?: string
  fileName?: string
}

export const Model3DViewer: React.FC<Model3DViewerProps> = ({ fileUrl, fileName }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<any>(null)
  const mouseRef = useRef({ x: 0, y: 0, isDragging: false })

  useEffect(() => {
    if (!fileUrl || !containerRef.current) return

    const initScene = async () => {
      try {
        // Dynamic imports to avoid build-time Three.js issues
        const THREE = await import('three')
        const { STLLoader } = await import('three/examples/jsm/loaders/STLLoader.js')

        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0xffffff)
        
        const camera = new THREE.PerspectiveCamera(
          75,
          containerRef.current!.clientWidth / containerRef.current!.clientHeight,
          0.1,
          1000
        )
        const renderer = new THREE.WebGLRenderer({ antialias: true })

        renderer.setSize(
          containerRef.current!.clientWidth,
          containerRef.current!.clientHeight
        )
        renderer.setPixelRatio(window.devicePixelRatio)
        containerRef.current!.appendChild(renderer.domElement)

        // Lighting
        const light = new THREE.DirectionalLight(0xffffff, 1)
        light.position.set(10, 10, 10)
        scene.add(light)

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        scene.add(ambientLight)

        // Load STL
        const loader = new STLLoader()
        loader.load(
          fileUrl,
          (geometry: any) => {
            const material = new THREE.MeshPhongMaterial({ 
              color: 0x808080,
              emissive: 0x404040,
              shininess: 200,
            })
            const mesh = new THREE.Mesh(geometry, material)

            // Center and scale
            geometry.center()
            geometry.computeBoundingBox()
            const size = geometry.boundingBox.getSize(new THREE.Vector3())
            const maxDim = Math.max(size.x, size.y, size.z)
            const scale = 100 / maxDim
            mesh.scale.multiplyScalar(scale)

            // Rotate -90 degrees on X axis
            mesh.rotation.x = -Math.PI / 2

            scene.add(mesh)
            sceneRef.current = { scene, camera, renderer, mesh }

            // Camera position
            camera.position.z = 150
            camera.lookAt(0, 0, 0)

            // Auto-rotation state
            let autoRotateX = 0
            let autoRotateY = 0
            let autoRotateZ = -0.003

            // Mouse move handler
            const handleMouseDown = (e: MouseEvent) => {
              mouseRef.current.isDragging = true
              mouseRef.current.x = e.clientX
              mouseRef.current.y = e.clientY
            }

            const handleMouseUp = () => {
              mouseRef.current.isDragging = false
            }

            const handleMouseMove = (e: MouseEvent) => {
              if (!mouseRef.current.isDragging || !sceneRef.current) return

              const deltaX = e.clientX - mouseRef.current.x
              const deltaY = e.clientY - mouseRef.current.y

              mesh.rotation.y += deltaX * 0.01
              mesh.rotation.x += deltaY * 0.01

              mouseRef.current.x = e.clientX
              mouseRef.current.y = e.clientY
            }

            // Add event listeners
            renderer.domElement.addEventListener('mousedown', handleMouseDown)
            renderer.domElement.addEventListener('mouseup', handleMouseUp)
            renderer.domElement.addEventListener('mousemove', handleMouseMove)

            // Render loop with slow auto-rotation
            const animate = () => {
              requestAnimationFrame(animate)
              
              // Auto-rotate when not dragging
              if (!mouseRef.current.isDragging) {
                mesh.rotation.x += autoRotateX
                mesh.rotation.y += autoRotateY
                mesh.rotation.z += autoRotateZ
              }
              
              renderer.render(scene, camera)
            }
            animate()

            // Handle window resize
            const handleResize = () => {
              if (!containerRef.current) return
              const w = containerRef.current.clientWidth
              const h = containerRef.current.clientHeight
              camera.aspect = w / h
              camera.updateProjectionMatrix()
              renderer.setSize(w, h)
            }

            window.addEventListener('resize', handleResize)

            // Cleanup
            return () => {
              window.removeEventListener('resize', handleResize)
              renderer.domElement.removeEventListener('mousedown', handleMouseDown)
              renderer.domElement.removeEventListener('mouseup', handleMouseUp)
              renderer.domElement.removeEventListener('mousemove', handleMouseMove)
            }
          },
          undefined,
          (error: any) => {
            console.error('Error loading STL:', error)
          }
        )
      } catch (error) {
        console.error('Error initializing 3D scene:', error)
      }
    }

    initScene()

    return () => {
      if (sceneRef.current?.renderer && containerRef.current?.contains(sceneRef.current.renderer.domElement)) {
        containerRef.current?.removeChild(sceneRef.current.renderer.domElement)
      }
    }
  }, [fileUrl])

  if (!fileUrl) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#ffffff'
      }}>
        <p>No 3D model file URL provided</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100vh',
        backgroundColor: '#ffffff',
      }}
    />
  )
}
