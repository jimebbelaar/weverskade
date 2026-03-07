import { defineType, defineField } from 'sanity'

export const overOnsPage = defineType({
  name: 'overOnsPage',
  title: 'Over Ons',
  type: 'document',
  fieldsets: [
    { name: 'hero', title: 'Hero Sectie' },
    { name: 'story', title: 'Verhaal Sectie' },
    { name: 'missionVision', title: 'Missie & Visie' },
    { name: 'watWijDoen', title: 'Wat Wij Doen' },
    { name: 'team', title: 'Team Sectie' },
    { name: 'facts', title: 'Feiten & Cijfers' },
    { name: 'impact', title: 'Impact Sectie' },
    { name: 'cta', title: 'Call to Action' },
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
      name: 'heroImage',
      title: 'Achtergrond afbeelding',
      type: 'image',
      options: { hotspot: true },
      fieldset: 'hero',
    }),
    // Story
    defineField({
      name: 'storyHeading',
      title: 'Heading',
      type: 'string',
      fieldset: 'story',
    }),
    defineField({
      name: 'storyText',
      title: 'Tekst',
      type: 'text',
      rows: 6,
      fieldset: 'story',
    }),
    defineField({
      name: 'storyImage',
      title: 'Afbeelding',
      type: 'image',
      options: { hotspot: true },
      fieldset: 'story',
    }),
    // Mission/Vision
    defineField({
      name: 'mvLabel',
      title: 'Label',
      type: 'string',
      fieldset: 'missionVision',
    }),
    defineField({
      name: 'mvHeading',
      title: 'Heading',
      type: 'string',
      fieldset: 'missionVision',
    }),
    defineField({
      name: 'missionText',
      title: 'Missie tekst',
      type: 'text',
      rows: 4,
      fieldset: 'missionVision',
    }),
    defineField({
      name: 'visionText',
      title: 'Visie tekst',
      type: 'text',
      rows: 4,
      fieldset: 'missionVision',
    }),
    // Wat wij doen
    defineField({
      name: 'wwdLabel',
      title: 'Label',
      type: 'string',
      fieldset: 'watWijDoen',
    }),
    defineField({
      name: 'wwdHeading',
      title: 'Heading',
      type: 'string',
      fieldset: 'watWijDoen',
    }),
    defineField({
      name: 'wwdItems',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Titel', type: 'string' }),
            defineField({ name: 'description', title: 'Beschrijving', type: 'text', rows: 3 }),
          ],
          preview: { select: { title: 'title' } },
        },
      ],
      fieldset: 'watWijDoen',
    }),
    // Team
    defineField({
      name: 'teamLabel',
      title: 'Label',
      type: 'string',
      fieldset: 'team',
    }),
    defineField({
      name: 'teamHeading',
      title: 'Heading',
      type: 'string',
      fieldset: 'team',
    }),
    // Facts
    defineField({
      name: 'factsLabel',
      title: 'Label',
      type: 'string',
      fieldset: 'facts',
    }),
    defineField({
      name: 'factsHeading',
      title: 'Heading',
      type: 'string',
      fieldset: 'facts',
    }),
    defineField({
      name: 'stats',
      title: 'Statistieken',
      type: 'array',
      of: [{ type: 'stat' }],
      fieldset: 'facts',
    }),
    // Impact
    defineField({
      name: 'impactHeading',
      title: 'Heading',
      type: 'string',
      fieldset: 'impact',
    }),
    defineField({
      name: 'impactText',
      title: 'Tekst',
      type: 'text',
      rows: 4,
      fieldset: 'impact',
    }),
    defineField({
      name: 'impactImages',
      title: 'Afbeeldingen',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      fieldset: 'impact',
    }),
    // CTA
    defineField({
      name: 'cta',
      title: 'CTA',
      type: 'sectionCta',
      fieldset: 'cta',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Over Ons Pagina' }
    },
  },
})
