'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import type { Page, Post, Media } from '@/payload-types'

type TwoColumnsHeroProps = Page['hero'] & {
  leftPosts?: (Post | string)[]
  rightPosts?: (Post | string)[]
}

// Render Lexical content with text and media blocks
const RenderLexicalContent: React.FC<{ content: any }> = ({ content }) => {
  if (!content || !content.root || !content.root.children) return null

  // Debug: log content structure
  console.log('RenderLexicalContent - content:', JSON.stringify(content.root.children, null, 2))

  const renderNode = (node: any, index: number): React.ReactNode => {
    console.log('Rendering node:', node.type, node)
    // Handle Lexical block nodes (mediaBlock, etc.)
    if (node.type === 'block') {
      const blockType = node.fields?.blockType
      
      // Handle mediaBlock
      if (blockType === 'mediaBlock') {
        const media = node.fields?.media
        if (media && typeof media === 'object') {
          const url = media.url
          const alt = media.alt || ''
          if (url) {
            return (
              <div key={index} className="post-image" style={{ marginBottom: '0' }}>
                <Image
                  src={url}
                  alt={alt}
                  width={800}
                  height={600}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>
            )
          }
        }
      }
      return null
    }

    // Handle upload nodes (inline images)
    if (node.type === 'upload') {
      const media = node.value
      if (media && typeof media === 'object') {
        const url = media.url
        const alt = media.alt || ''
        if (url) {
          return (
            <div key={index} className="post-image" style={{ marginBottom: '0' }}>
              <Image
                src={url}
                alt={alt}
                width={800}
                height={600}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          )
        }
      }
      return null
    }

    // Handle paragraph nodes
    if (node.type === 'paragraph') {
      const text = node.children?.map((child: any) => child.text || '').join('') || ''
      if (text.trim()) {
        return <p key={index} className="post-excerpt">{text}</p>
      }
      return null
    }

    // Handle text nodes directly
    if (node.text) {
      return node.text
    }

    // Handle other nodes with children
    if (node.children && Array.isArray(node.children)) {
      return node.children.map((child: any, i: number) => renderNode(child, i))
    }

    return null
  }

  return (
    <>
      {content.root.children.map((node: any, index: number) => renderNode(node, index))}
    </>
  )
}

export const TwoColumnsHero: React.FC<TwoColumnsHeroProps> = ({ 
  leftPosts = [], 
  rightPosts = [] 
}) => {
  const [leftPostsData, setLeftPostsData] = useState<Post[]>([])
  const [rightPostsData, setRightPostsData] = useState<Post[]>([])

  // Extract IDs from posts (could be objects or strings)
  const getPostIds = (posts: (Post | string)[]) => {
    return posts.map(p => typeof p === 'object' ? p.id : p)
  }

  console.log('TwoColumnsHero render - leftPosts:', leftPosts, 'rightPosts:', rightPosts)

  useEffect(() => {
    const fetchPosts = async () => {
      const leftIds = getPostIds(leftPosts)
      const rightIds = getPostIds(rightPosts)
      
      console.log('Fetching posts - leftIds:', leftIds, 'rightIds:', rightIds)
      
      if (leftIds.length > 0) {
        const res = await fetch(`/api/posts?where[id][in]=${leftIds.join(',')}&depth=2&sort=order`)
        const data = await res.json()
        console.log('Left posts data:', data)
        setLeftPostsData(data.docs || [])
      }
      
      if (rightIds.length > 0) {
        const res = await fetch(`/api/posts?where[id][in]=${rightIds.join(',')}&depth=2&sort=order`)
        const data = await res.json()
        console.log('Right posts data:', data)
        setRightPostsData(data.docs || [])
      }
    }
    
    fetchPosts()
  }, [leftPosts, rightPosts])

  return (
    <>
      <style>{`
        .two-columns-container {
          display: flex;
          width: 100vw;
          height: 100vh;
          background: #fff;
        }

        .column {
          flex: 1.5;
          height: 100%;
          overflow-y: auto;
          padding: 0;
          box-sizing: border-box;
        }

        .column::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }

        .column-left {
          padding-left: 0;
        }

        .column-right {
          padding-right: 0;
        }

        .post-item {
          margin-bottom: 0;
        }

        .post-item:last-child {
          margin-bottom: 0;
        }

        .post-image {
          width: 100%;
          height: auto;
          margin-bottom: 0;
        }

        .post-image img {
          width: 100%;
          height: auto;
          object-fit: cover;
          display: block;
        }

        .post-title {
          font-size: 14px;
          font-weight: 400;
          margin: 0;
          font-family: Arial, sans-serif;
          color: #000;
          line-height: 1.4;
        }

        .post-title a {
          color: #000;
          text-decoration: none;
        }

        .post-title a:hover {
          text-decoration: underline;
        }

        .post-excerpt {
          font-size: 14px;
          color: #000;
          line-height: 1.4;
          font-family: Arial, sans-serif;
          margin: 0;
        }

        @media (max-width: 768px) {
          .two-columns-container {
            flex-direction: column;
            height: auto;
            min-height: 100vh;
            overflow-y: visible;
          }

          .column {
            height: auto;
            min-height: auto;
            overflow-y: visible;
            padding: 0;
            flex: none;
          }

          .column-left {
            padding-bottom: 0;
          }

          .column-right {
            padding-top: 0;
          }

          .post-item {
            margin-bottom: 0;
          }
        }
      `}</style>

      <div className="two-columns-container">
        <div className="column column-left">
          {leftPostsData.map((post, idx) => {
            const heroImage = post.heroImage
            const imageUrl = typeof heroImage === 'object' ? heroImage?.url : null
            const imageAlt = typeof heroImage === 'object' ? heroImage?.alt : ''

            return (
              <div key={post.id || idx} className="post-item">
                {imageUrl && (
                  <div className="post-image">
                    <Image
                      src={imageUrl}
                      alt={imageAlt || post.title || ''}
                      width={800}
                      height={600}
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </div>
                )}
                <RenderLexicalContent content={post.content} />
              </div>
            )
          })}
        </div>

        <div className="column column-right">
          {rightPostsData.map((post, idx) => {
            const heroImage = post.heroImage
            const imageUrl = typeof heroImage === 'object' ? heroImage?.url : null
            const imageAlt = typeof heroImage === 'object' ? heroImage?.alt : ''

            return (
              <div key={post.id || idx} className="post-item">
                {imageUrl && (
                  <div className="post-image">
                    <Image
                      src={imageUrl}
                      alt={imageAlt || post.title || ''}
                      width={800}
                      height={600}
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </div>
                )}
                <RenderLexicalContent content={post.content} />
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
