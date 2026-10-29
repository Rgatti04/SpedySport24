import type { AttributeKey, ConditionId, OfferTypeId, SportId, SubcategoryId } from './catalog'

export interface GeoPoint {
  lat: number
  lng: number
}

export interface Location extends GeoPoint {
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

interface SellerBase {
  id: string
  displayName: string
  avatarUrl: string | null
  /** Media recensioni 0–5 (in produzione: solo recensioni legate a transazioni reali). */
  rating: number
  reviewCount: number
  /** ISO 8601. */
  memberSince: string
  /** Tempo medio di risposta in ore. */
  responseTimeHours: number
  /**
   * Data della verifica (identità per i privati, partita IVA per i negozi).
   * `null` = non verificato: nessun badge viene mostrato.
   */
  verifiedAt: string | null
  location: Location
}

export interface PrivateSeller extends SellerBase {
  kind: 'privato'
  soldCount: number
}

export interface ShopProfile {
  legalName: string
  vatNumber: string
  address: string
  phone: string
  openingHours: string
  description: string
  /** Condizioni di vendita dichiarate dal negozio. */
  policies: {
    returnDays: number
    warrantyNote: string
    paymentMethods: readonly string[]
  }
}

export interface ShopSeller extends SellerBase {
  kind: 'negozio'
  shop: ShopProfile
}

export type Seller = PrivateSeller | ShopSeller

export interface ListingDelivery {
  shipping: boolean
  /** Costo della spedizione in centesimi; `null` = da concordare con il venditore. */
  shippingCostCents: number | null
  /** Ritiro di persona presso il venditore. */
  pickup: boolean
}

/** Ciclo di vita dell'annuncio: i venduti escono dalla ricerca ma la pagina resta raggiungibile. */
export type ListingStatus = 'disponibile' | 'riservato' | 'venduto'

export type AttributeValue = string | number | boolean

export type ListingAttributes = Partial<Record<AttributeKey, AttributeValue>>

/**
 * Annuncio così come lo consuma la UI (venditore già "joinato").
 * La forma persistita è `ListingRecord` (vedi `mocks/listings.ts`).
 */
export interface Listing {
  id: string
  title: string
  description: string
  sportId: SportId
  subcategoryId: SubcategoryId
  brand: string
  model: string | null
  offerType: OfferTypeId
  /** Valorizzato solo per l'usato. */
  condition: ConditionId | null
  /** Difetti dichiarati dal venditore (vuoto = nessun difetto dichiarato). */
  defects: string[]
  /** Prezzo richiesto in centesimi di euro. */
  priceCents: number
  images: ListingImage[]
  /** Scheda tecnica strutturata, filtrabile: le chiavi dipendono dalla sottocategoria. */
  attributes: ListingAttributes
  /** Dettagli liberi non filtrabili (km percorsi, anno di acquisto…). */
  extraSpecs: ListingSpec[]
  location: Location
  delivery: ListingDelivery
  status: ListingStatus
  /** Pezzi disponibili (rilevante per i negozi). */
  quantity: number
  favoritesCount: number
  /** ISO 8601. */
  createdAt: string
  seller: Seller
}
