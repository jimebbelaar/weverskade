import { defineType, defineField } from 'sanity'

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact',
  type: 'document',
  fieldsets: [
    { name: 'hero', title: 'Hero Sectie' },
    { name: 'info', title: 'Contact Informatie' },
  ],
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Titel',
      type: 'string',
      fieldset: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: 'Afbeelding',
      type: 'image',
      options: { hotspot: true },
      fieldset: 'hero',
    }),
    defineField({
      name: 'contactItems',
      title: 'Contact items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'value', title: 'Waarde', type: 'string' }),
            defineField({ name: 'linkUrl', title: 'Link URL (optioneel)', type: 'string' }),
          ],
          preview: { select: { title: 'label', subtitle: 'value' } },
        },
      ],
      fieldset: 'info',
    }),
    defineField({
      name: 'formHeading',
      title: 'Formulier heading',
      type: 'string',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Contact Pagina' }
    },
  },
})
