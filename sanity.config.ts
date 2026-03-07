import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'
import { schemaTypes, singletonTypes } from './sanity/schemas'
import { structure } from './sanity/desk'
import { apiVersion, dataset, projectId } from './sanity/env'

export default defineConfig({
  name: 'weverskade',
  title: 'Weverskade',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) =>
            action && ['publish', 'discardChanges', 'restore'].includes(action)
          )
        : input,
  },
})
