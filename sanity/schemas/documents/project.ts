import { defineType, defineField } from 'sanity'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'

export const project = defineType({
  name: 'project',
  title: 'Projecten',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Naam',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Kantoor', value: 'Kantoor' },
          { title: 'Woning', value: 'Woning' },
          { title: 'Retail', value: 'Retail' },
          { title: 'Gemengd', value: 'Gemengd' },
        ],
      },
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'In ontwikkeling', value: 'In ontwikkeling' },
          { title: 'Opgeleverd', value: 'Opgeleverd' },
          { title: 'In beheer', value: 'In beheer' },
        ],
      },
    }),
    defineField({
      name: 'category',
      title: 'Categorie (portefeuille)',
      type: 'string',
      options: {
        list: [
          { title: 'Eigendom', value: 'Eigendom' },
          { title: 'In ontwikkeling', value: 'In ontwikkeling' },
          { title: 'Facility Management', value: 'Facility Management' },
        ],
      },
    }),
    defineField({
      name: 'location',
      title: 'Locatie',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Adres',
      type: 'string',
    }),
    defineField({
      name: 'size',
      title: 'Oppervlakte',
      type: 'string',
    }),
    defineField({
      name: 'year',
      title: 'Jaar',
      type: 'string',
    }),
    defineField({
      name: 'breeam',
      title: 'BREEAM score',
      type: 'string',
    }),
    defineField({
      name: 'epc',
      title: 'EPC label',
      type: 'string',
    }),
    defineField({
      name: 'partners',
      title: 'Partners',
      type: 'string',
    }),
    defineField({
      name: 'wonenBeschikbaar',
      title: 'Woningen beschikbaar',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'showInPortfolio',
      title: 'Tonen in portefeuille',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showInWonen',
      title: 'Tonen op wonen-bij pagina',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'hasDetailPage',
      title: 'Heeft detailpagina',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'portfolioImage',
      title: 'Portfolio afbeelding (grid)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero afbeelding',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'fullWidthImage',
      title: 'Volledige breedte afbeelding',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'smallImages',
      title: 'Kleine afbeeldingen',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (rule) => rule.max(2),
    }),
    defineField({
      name: 'descriptionLeft',
      title: 'Beschrijving links',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'descriptionRight',
      title: 'Beschrijving rechts',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'quoteAuthor',
      title: 'Quote auteur',
      type: 'string',
    }),
    defineField({
      name: 'quoteAuthorImage',
      title: 'Quote auteur foto',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'mapLat',
      title: 'Breedte (latitude)',
      type: 'number',
    }),
    defineField({
      name: 'mapLng',
      title: 'Lengte (longitude)',
      type: 'number',
    }),
    orderRankField({ type: 'project' }),
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: {
      title: 'name',
      subtitle: 'location',
      media: 'portfolioImage',
    },
  },
})
