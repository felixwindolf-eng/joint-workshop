import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'High Impact',
          value: 'highImpact',
        },
        {
          label: 'Medium Impact',
          value: 'mediumImpact',
        },
        {
          label: 'Low Impact',
          value: 'lowImpact',
        },
        {
          label: 'Grid Gallery',
          value: 'gridGallery',
        },
        {
          label: 'Two Columns',
          value: 'twoColumns',
        },
        {
          label: '3D Model Viewer',
          value: 'models3d',
        },
      ],
      required: true,
    },
    {
      name: 'leftPosts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      admin: {
        condition: (_, { type } = {}) => type === 'twoColumns',
        sortOptions: 'title',
      },
      maxRows: 100,
    },
    {
      name: 'rightPosts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      admin: {
        condition: (_, { type } = {}) => type === 'twoColumns',
        sortOptions: 'title',
      },
      maxRows: 100,
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
      relationTo: 'media',
      required: true,
    },
    {
      name: 'galleryImages',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
      admin: {
        condition: (_, { type } = {}) => type === 'gridGallery',
      },
      required: true,
    },
    {
      name: 'model3dId',
      type: 'relationship',
      relationTo: '3d-models',
      admin: {
        condition: (_, { type } = {}) => type === 'models3d',
      },
    },
  ],
  label: false,
}
