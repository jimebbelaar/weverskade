import { defineType, defineField } from 'sanity'

export const vacature = defineType({
  name: 'vacature',
  title: 'Vacatures',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Functietitel',
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
      name: 'shortDescription',
      title: 'Korte omschrijving',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'body',
      title: 'Inhoud',
      type: 'portableText',
    }),
    defineField({
      name: 'isActive',
      title: 'Actief',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'shortDescription',
    },
  },
})
