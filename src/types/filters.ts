import type { ProductCategoryId, SportId } from './catalog'

export type SortOption = 'recent' | 'price-asc' | 'price-desc'

/**
 * Stato dei filtri di ricerca. È serializzabile (URL / query API):
 * con un backend reale diventa direttamente il payload della query.
 */
export interface ListingFilters {
  query: string
  sport: SportId | null
  category: ProductCategoryId | null
  /** Città, provincia o CAP (anche parziale). */
  location: string
  fastShippingOnly: boolean
  sort: SortOption
}
