import { defineType, defineField } from 'sanity'

export const werkenBijPage = defineType({
  name: 'werkenBijPage',
  title: 'Werken Bij',
  type: 'document',
  fields: [
    defineField({
      name: 'heroLabel',
      title: 'Hero label',
      type: 'string',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero titel',
      type: 'string',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Beschrijving',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact e-mail',
      type: 'string',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Werken Bij Pagina' }
    },
  },
})
