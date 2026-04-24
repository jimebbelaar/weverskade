import { defineType, defineField } from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home',
  type: 'document',
  fieldsets: [
    { name: 'hero', title: 'Hero Sectie' },
    { name: 'intro', title: 'Introductie Sectie' },
    { name: 'portfolio', title: 'Portfolio Sectie' },
    { name: 'impact', title: 'Impact Sectie' },
    { name: 'news', title: 'Nieuws Sectie' },
  ],
  fields: [
    // Hero
    defineField({
      name: 'heroTitle',
      title: 'Titel',
      type: 'string',
      fieldset: 'hero',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Ondertitel',
      type: 'string',
      fieldset: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: 'Achtergrond afbeelding',
      type: 'image',
      options: { hotspot: true },
      fieldset: 'hero',
      description: 'Wordt gebruikt als poster (vóór de video laadt) en als fallback als er geen Hero video URL is.',
    }),
    defineField({
      name: 'heroVideoUrl',
      title: 'Hero Vimeo video URL',
      type: 'url',
      fieldset: 'hero',
      description: 'Optioneel. Als ingevuld, wordt de video full-screen als achtergrond afgespeeld (zonder geluid). Bijv. https://vimeo.com/123456789',
    }),
    // Intro
    defineField({
      name: 'introHeading',
      title: 'Heading',
      type: 'string',
      fieldset: 'intro',
    }),
    defineField({
      name: 'introText',
      title: 'Tekst',
      type: 'text',
      rows: 4,
      fieldset: 'intro',
    }),
    defineField({
      name: 'introLinkText',
      title: 'Link tekst',
      type: 'string',
      fieldset: 'intro',
    }),
    defineField({
      name: 'introLinkUrl',
      title: 'Link URL',
      type: 'string',
      fieldset: 'intro',
    }),
    defineField({
      name: 'introImage',
      title: 'Afbeelding',
      type: 'image',
      options: { hotspot: true },
      fieldset: 'intro',
    }),
    // Portfolio
    defineField({
      name: 'portfolioLabel',
      title: 'Label',
      type: 'string',
      fieldset: 'portfolio',
    }),
    defineField({
      name: 'portfolioHeading',
      title: 'Heading',
      type: 'string',
      fieldset: 'portfolio',
    }),
    defineField({
      name: 'portfolioLinkText',
      title: 'Link tekst',
      type: 'string',
      fieldset: 'portfolio',
    }),
    defineField({
      name: 'portfolioLinkUrl',
      title: 'Link URL',
      type: 'string',
      fieldset: 'portfolio',
    }),
    defineField({
      name: 'featuredProjects',
      title: 'Uitgelichte projecten',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
      fieldset: 'portfolio',
    }),
    // Impact
    defineField({
      name: 'impactLabel',
      title: 'Label',
      type: 'string',
      fieldset: 'impact',
    }),
    defineField({
      name: 'impactHeading',
      title: 'Heading',
      type: 'string',
      fieldset: 'impact',
    }),
    defineField({
      name: 'impactWords',
      title: 'Roterende woorden',
      type: 'array',
      of: [{ type: 'string' }],
      fieldset: 'impact',
    }),
    defineField({
      name: 'impactDescription',
      title: 'Beschrijving',
      type: 'text',
      rows: 4,
      fieldset: 'impact',
    }),
    defineField({
      name: 'impactLinkText',
      title: 'Link tekst',
      type: 'string',
      fieldset: 'impact',
    }),
    defineField({
      name: 'impactLinkUrl',
      title: 'Link URL',
      type: 'string',
      fieldset: 'impact',
    }),
    defineField({
      name: 'impactImages',
      title: 'Afbeeldingen (3 lagen)',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (rule) => rule.max(3),
      fieldset: 'impact',
    }),
    // News
    defineField({
      name: 'newsLabel',
      title: 'Label',
      type: 'string',
      fieldset: 'news',
    }),
    defineField({
      name: 'newsHeading',
      title: 'Heading',
      type: 'string',
      fieldset: 'news',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Home Pagina' }
    },
  },
})
