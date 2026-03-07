import { defineType, defineField } from 'sanity'

export const sectionCta = defineType({
  name: 'sectionCta',
  title: 'CTA Sectie',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'linkText',
      title: 'Link tekst',
      type: 'string',
    }),
    defineField({
      name: 'linkUrl',
      title: 'Link URL',
      type: 'string',
    }),
  ],
})
