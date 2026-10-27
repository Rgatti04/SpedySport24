import type { ConditionId, ProductCategoryId, SportId } from './catalog'

export interface Location {
  city: string
  /** Sigla provincia, es. "MI". */
  province: string
  postalCode: string
  region: string
}

export interface ListingImage {
  id: string
  url: string
  alt: string
}

export interface ListingSpec {
  label: string
  value: string
}

export interface Seller {
  id: string
  displayName: string
  avatarUrl: string | null
  /** Media recensioni 0–5. */
  rating: number
  reviewCount: number
  soldCount: number
  /** ISO 8601. */
  memberSince: string
  /** Tempo medio di risposta in ore. */
  responseTimeHours: number
  isVerified: boolean
}

/**
 * Annuncio così come lo consuma la UI (venditore già "joinato").
 * La forma persistita è `ListingRecord` (vedi `mocks/listings.ts`).
 */
export interface Listing {
  id: string
  title: string
  description: string
  sportId: SportId
  categoryId: ProductCategoryId
  brand: string
  /** Prezzo in centesimi di euro. */
  priceCents: number
  /** Prezzo da nuovo, in centesimi (opzionale). */
  originalPriceCents?: number
  condition: ConditionId
  images: ListingImage[]
  specs: ListingSpec[]
  location: Location
  /** Il venditore aderisce alla Spedizione rapida 24h. */
  hasFastShipping: boolean
  favoritesCount: number
  /** ISO 8601. */
  createdAt: string
  seller: Seller
}
