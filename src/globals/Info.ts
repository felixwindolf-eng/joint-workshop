import type { GlobalConfig } from 'payload'

export const Info: GlobalConfig = {
  slug: 'info',
  label: 'Info Page',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      defaultValue: 'INFO',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      defaultValue: 'Joint Workshop är ett kreativt studio baserat i Stockholm.',
    },
    {
      name: 'contactText',
      type: 'text',
      label: 'Contact Text',
      defaultValue: 'För förfrågningar och samarbeten, kontakta oss på:',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      defaultValue: 'hello@jointworkshop.com',
    },
    {
      name: 'instagram',
      type: 'text',
      label: 'Instagram Handle',
      defaultValue: '@jointworkshop',
    },
    {
      name: 'instagramUrl',
      type: 'text',
      label: 'Instagram URL',
      defaultValue: 'https://instagram.com/jointworkshop',
    },
  ],
}
