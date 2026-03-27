import type { Metadata } from 'next'

import type { Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url

    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

type DocWithMeta = {
  meta?: {
    title?: string | null
    description?: string | null
    image?: Media | string | null
  }
  slug?: string | string[]
  title?: string
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | DocWithMeta | null
}): Promise<Metadata> => {
  const { doc } = args
  const docWithMeta = doc as DocWithMeta | null

  const ogImage = getImageURL(docWithMeta?.meta?.image as Media | undefined)

  const title = docWithMeta?.meta?.title
    ? docWithMeta?.meta?.title + ' | Payload Website Template'
    : 'Payload Website Template'

  return {
    description: docWithMeta?.meta?.description,
    openGraph: mergeOpenGraph({
      description: docWithMeta?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: Array.isArray(docWithMeta?.slug) ? docWithMeta?.slug.join('/') : '/',
    }),
    title,
  }
}
