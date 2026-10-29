import type {
  AttributeKey,
  ConditionId,
  DeliveryMode,
  OfferGroupId,
  ProductCategoryId,
  SellerKind,
  SportId,
  SubcategoryId,
} from './catalog'

export type SortOption = 'relevance' | 'recent' | 'price-asc' | 'price-desc' | 'distance'

export interface NumberRange {
  min: number | null
  max: number | null
}

/** Valori multipli per gli attributi a scelta, intervallo per quelli numerici, `true` per i sì/no. */
export type AttributeFilterValue = string[] | NumberRange | true

export type AttributeFilters = Partial<Record<AttributeKey, AttributeFilterValue>>

/**
 * Stato della ricerca. È serializzabile (URL / query API):
 * con un backend reale diventa direttamente il payload della query.
 */
export interface ListingFilters {
  query: string
  sport: SportId | null
  category: ProductCategoryId | null
  subcategory: SubcategoryId | null
  /** Vuoto = tutte le tipologie. */
  offerGroups: OfferGroupId[]
  /** Si applica solo agli annunci di usato. */
  conditions: ConditionId[]
  /** Euro interi. */
  priceMin: number | null
  priceMax: number | null
  /** Città, provincia, regione o CAP (anche parziale). */
  location: string
  radiusKm: number | null
  sellerKinds: SellerKind[]
  deliveryModes: DeliveryMode[]
  /** Esclude gli annunci riservati. */
  onlyAvailable: boolean
  brands: string[]
  model: string
  attributes: AttributeFilters
  sort: SortOption
}
