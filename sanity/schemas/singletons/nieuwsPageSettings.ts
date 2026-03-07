import { defineType, defineField } from 'sanity'

export const nieuwsPageSettings = defineType({
  name: 'nieuwsPageSettings',
  title: 'Nieuws Pagina',
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
  ],
  preview: {
    prepare() {
      return { title: 'Nieuws Pagina Instellingen' }
    },
  },
})
