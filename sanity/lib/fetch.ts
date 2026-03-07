import type { QueryParams } from 'next-sanity'
import { client } from './client'
import { projectId } from '../env'

export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
}: {
  query: string
  params?: QueryParams
  tags?: string[]
}): Promise<T> {
  if (!projectId) return null as T

  try {
    return await client.fetch<T>(query, params, {
      next: {
        revalidate: 60,
        tags: ['sanity', ...tags],
      },
    })
  } catch {
    return null as T
  }
}
