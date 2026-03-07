import { defineType, defineField } from 'sanity'

export const footer = defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    defineField({
      name: 'companyName',
      title: 'Bedrijfsnaam',
      type: 'string',
    }),
    defineField({
      name: 'links',
      title: 'Navigatie links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'url', title: 'URL', type: 'string' }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'url' },
          },
        },
      ],
    }),
    defineField({
      name: 'address',
      title: 'Adres',
      type: 'string',
    }),
    defineField({
      name: 'postalCode',
      title: 'Postcode en plaats',
      type: 'string',
    }),
    defineField({
      name: 'country',
      title: 'Land',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Telefoonnummer',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'E-mail',
      type: 'string',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Footer' }
    },
  },
})
