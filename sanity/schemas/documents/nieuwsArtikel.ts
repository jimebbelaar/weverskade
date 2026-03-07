import { defineType, defineField } from 'sanity'

export const nieuwsArtikel = defineType({
  name: 'nieuwsArtikel',
  title: 'Nieuwsberichten',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Datum',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Categorie',
      type: 'string',
    }),
    defineField({
      name: 'excerpt',
      title: 'Korte samenvatting',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero afbeelding',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'body',
      title: 'Inhoud',
      type: 'portableText',
    }),
  ],
  orderings: [
    {
      title: 'Datum (nieuwste eerst)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'date',
      media: 'heroImage',
    },
  },
})
