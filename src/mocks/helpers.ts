import { unsplashPhotoUrl } from '@/lib/images'
import type { ListingImage } from '@/types'

export function photo(photoId: string, alt: string): ListingImage {
  return { id: photoId, url: unsplashPhotoUrl(photoId), alt }
}

/** Date relative a "adesso", così il prototipo mostra sempre annunci freschi. */
export function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
}

export function euro(amount: number): number {
  return Math.round(amount * 100)
}
