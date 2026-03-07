import { defineType, defineField } from 'sanity'

export const stat = defineType({
  name: 'stat',
  title: 'Statistiek',
  type: 'object',
  fields: [
    defineField({
      name: 'value',
      title: 'Waarde',
      type: 'string',
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
    }),
    defineField({
      name: 'suffix',
      title: 'Suffix (bijv. m², %)',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'value', subtitle: 'label' },
  },
})
