import { getPlaceByCity } from '@/config/places'
import { unsplashPhotoUrl } from '@/lib/images'
import type { ListingDelivery, ListingImage, Location } from '@/types'

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

/** Località con coordinate prese dal gazetteer (le distanze restano coerenti). */
export function locatedIn(city: string, postalCode: string): Location {
  const place = getPlaceByCity(city)
  if (!place) throw new Error(`Città "${city}" assente dal gazetteer`)
  return { city: place.city, province: place.province, region: place.region, postalCode, lat: place.lat, lng: place.lng }
}

/** Spedizione con costo noto (`null` = da concordare), ritiro di persona attivo di default. */
export function shipping(costCents: number | null, pickup = true): ListingDelivery {
  return { shipping: true, shippingCostCents: costCents, pickup }
}

export const PICKUP_ONLY: ListingDelivery = { shipping: false, shippingCostCents: null, pickup: true }
