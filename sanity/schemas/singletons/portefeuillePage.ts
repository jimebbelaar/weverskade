import { defineType, defineField } from 'sanity'

export const portefeuillePage = defineType({
  name: 'portefeuillePage',
  title: 'Portefeuille',
  type: 'document',
  fieldsets: [
    { name: 'hero', title: 'Hero Sectie' },
  ],
  fields: [
    defineField({
      name: 'heroLabel',
      title: 'Label',
      type: 'string',
      fieldset: 'hero',
    }),
    defineField({
      name: 'heroTitle',
      title: 'Titel',
      type: 'string',
      fieldset: 'hero',
    }),
    defineField({
      name: 'heroImages',
      title: 'Hero slideshow afbeeldingen',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      fieldset: 'hero',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'CTA label',
      type: 'string',
    }),
    defineField({
      name: 'ctaHeading',
      title: 'CTA heading',
      type: 'string',
    }),
    defineField({
      name: 'ctaLinkText',
      title: 'CTA link tekst',
      type: 'string',
    }),
    defineField({
      name: 'ctaLinkUrl',
      title: 'CTA link URL',
      type: 'string',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Portefeuille Pagina' }
    },
  },
})
