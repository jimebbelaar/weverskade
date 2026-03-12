import { urlFor } from './image'

export function sanityImageUrl(image: any, fallback: string): string {
  if (!image?.asset) return fallback
  return urlFor(image).format('webp').quality(90).url()
}

export function sanityImageUrlSized(image: any, fallback: string, width: number): string {
  if (!image?.asset) return fallback
  return urlFor(image).width(width).format('webp').quality(90).url()
}

export function formatSanityDate(dateStr: string | undefined, fallback: string): string {
  if (!dateStr) return fallback
  const date = new Date(dateStr)
  const months = [
    'januari', 'februari', 'maart', 'april', 'mei', 'juni',
    'juli', 'augustus', 'september', 'oktober', 'november', 'december',
  ]
  return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`
}
