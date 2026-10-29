import { ATTRIBUTES, formatAttributeValue, getAttribute } from '@/config/attributes'
import { distanceKm, resolvePlace, type Place } from '@/config/places'
import {
  DELIVERY_MODES,
  getCategory,
  getCondition,
  getOfferGroup,
  getOfferType,
  getSport,
  getSubcategory,
  SELLER_KINDS,
} from '@/config/taxonomy'
import { formatPrice } from '@/lib/format'
import { buildSearchDocument, scoreDocument, tokenizeQuery, type SearchDocument } from '@/lib/search'
import { normalizeText } from '@/lib/text'
import type {
  AttributeFilters,
  AttributeFilterValue,
  AttributeKey,
  GeoPoint,
  Listing,
  ListingFilters,
  NumberRange,
  OfferGroupId,
  ProductCategoryId,
  SortOption,
  SportId,
} from '@/types'

export const DEFAULT_FILTERS: ListingFilters = {
  query: '',
  sport: null,
  category: null,
  subcategory: null,
  offerGroups: [],
  conditions: [],
  priceMin: null,
  priceMax: null,
  location: '',
  radiusKm: null,
  sellerKinds: [],
  deliveryModes: [],
  onlyAvailable: false,
  brands: [],
  model: '',
  attributes: {},
  sort: 'relevance',
}

export const SORT_OPTIONS: readonly { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Pertinenza' },
  { value: 'recent', label: 'Più recenti' },
  { value: 'price-asc', label: 'Prezzo crescente' },
  { value: 'price-desc', label: 'Prezzo decrescente' },
  { value: 'distance', label: 'Più vicini' },
]

export const RADIUS_OPTIONS: readonly number[] = [10, 25, 50, 100, 200]

export function isSortOption(value: unknown): value is SortOption {
  return SORT_OPTIONS.some((option) => option.value === value)
}

/** Gruppo di filtri: serve per i conteggi "escludendo sé stesso" e per i suggerimenti a zero risultati. */
export type FacetKey =
  | 'query'
  | 'sport'
  | 'category'
  | 'subcategory'
  | 'offerGroups'
  | 'conditions'
  | 'price'
  | 'location'
  | 'sellerKinds'
  | 'deliveryModes'
  | 'onlyAvailable'
  | 'brands'
  | 'model'
  | `attr:${AttributeKey}`

export function getOfferGroupOf(listing: Listing): OfferGroupId {
  return getOfferType(listing.offerType).group
}

export function getCategoryOf(listing: Listing): ProductCategoryId {
  return getSubcategory(listing.subcategoryId).categoryId
}

const documents = new WeakMap<Listing, SearchDocument>()

function getDocument(listing: Listing): SearchDocument {
  let document = documents.get(listing)
  if (!document) {
    const subcategory = getSubcategory(listing.subcategoryId)
    const attributeLabels = Object.entries(listing.attributes).flatMap(([key, value]) => {
      const definition = ATTRIBUTES[key as AttributeKey]
      return definition.kind === 'enum' && value !== undefined ? [formatAttributeValue(definition, value)] : []
    })
    document = buildSearchDocument(listing.title, [
      listing.brand,
      listing.model ?? '',
      getSport(listing.sportId).label,
      subcategory.label,
      getCategory(subcategory.categoryId).label,
      getOfferType(listing.offerType).label,
      listing.seller.displayName,
      ...attributeLabels,
      listing.description,
    ])
    documents.set(listing, document)
  }
  return document
}

interface SearchContext {
  tokens: string[]
  /** Località riconosciuta dal testo inserito, usata per distanza e ordinamento. */
  origin: Place | null
}

function createContext(filters: ListingFilters): SearchContext {
  return { tokens: tokenizeQuery(filters.query), origin: resolvePlace(filters.location) }
}

export function getListingDistance(listing: Listing, origin: GeoPoint | null): number | null {
  return origin ? distanceKm(origin, listing.location) : null
}

/** Accetta città ("mil"), sigla provincia ("MI"), regione ("lomb") o CAP anche parziale ("201"). */
function matchesLocationText(listing: Listing, rawLocation: string): boolean {
  const needle = normalizeText(rawLocation)
  if (!needle) return true

  const { city, province, postalCode, region } = listing.location
  if (/^\d+$/.test(needle)) return postalCode.startsWith(needle)

  return (
    normalizeText(city).includes(needle) ||
    normalizeText(province) === needle ||
    normalizeText(region).startsWith(needle)
  )
}

function matchesRange(value: number, { min, max }: NumberRange): boolean {
  return (min === null || value >= min) && (max === null || value <= max)
}

function matchesAttribute(listing: Listing, key: AttributeKey, filter: AttributeFilterValue): boolean {
  const value = listing.attributes[key]
  if (value === undefined) return false
  if (filter === true) return value === true
  if (Array.isArray(filter)) return filter.includes(String(value))
  return typeof value === 'number' && matchesRange(value, filter)
}

function matchesFilters(listing: Listing, filters: ListingFilters, context: SearchContext, exclude?: FacetKey): boolean {
  // I venduti restano raggiungibili dal link diretto, ma non compaiono nella ricerca.
  if (listing.status === 'venduto') return false
  const applies = (facet: FacetKey) => facet !== exclude

  if (applies('sport') && filters.sport && listing.sportId !== filters.sport) return false
  if (applies('category') && filters.category && getCategoryOf(listing) !== filters.category) return false
  if (applies('subcategory') && filters.subcategory && listing.subcategoryId !== filters.subcategory) return false
  if (applies('offerGroups') && filters.offerGroups.length > 0 && !filters.offerGroups.includes(getOfferGroupOf(listing))) {
    return false
  }
  // Le condizioni filtrano solo l'usato: nuovo e mai usato restano visibili.
  if (
    applies('conditions') &&
    filters.conditions.length > 0 &&
    listing.condition !== null &&
    !filters.conditions.includes(listing.condition)
  ) {
    return false
  }
  if (applies('price') && !matchesRange(listing.priceCents / 100, { min: filters.priceMin, max: filters.priceMax })) {
    return false
  }
  if (applies('location') && filters.location.trim()) {
    const withinRadius =
      filters.radiusKm !== null && context.origin
        ? distanceKm(context.origin, listing.location) <= filters.radiusKm
        : matchesLocationText(listing, filters.location)
    if (!withinRadius) return false
  }
  if (applies('sellerKinds') && filters.sellerKinds.length > 0 && !filters.sellerKinds.includes(listing.seller.kind)) {
    return false
  }
  if (
    applies('deliveryModes') &&
    filters.deliveryModes.length > 0 &&
    !filters.deliveryModes.some((mode) => (mode === 'spedizione' ? listing.delivery.shipping : listing.delivery.pickup))
  ) {
    return false
  }
  if (applies('onlyAvailable') && filters.onlyAvailable && listing.status !== 'disponibile') return false
  if (applies('brands') && filters.brands.length > 0) {
    const brand = normalizeText(listing.brand)
    if (!filters.brands.some((selected) => normalizeText(selected) === brand)) return false
  }
  if (applies('model') && filters.model.trim() && !normalizeText(listing.model ?? '').includes(normalizeText(filters.model))) {
    return false
  }
  for (const [key, value] of Object.entries(filters.attributes)) {
    const attributeKey = key as AttributeKey
    if (value === undefined || !applies(`attr:${attributeKey}`)) continue
    if (!matchesAttribute(listing, attributeKey, value)) return false
  }
  if (applies('query') && context.tokens.length > 0 && scoreDocument(getDocument(listing), context.tokens) === 0) {
    return false
  }
  return true
}

function byRecent(a: Listing, b: Listing): number {
  return b.createdAt.localeCompare(a.createdAt)
}

function sortListings(listings: Listing[], sort: SortOption, context: SearchContext): Listing[] {
  const { origin, tokens } = context
  switch (sort) {
    case 'price-asc':
      return listings.sort((a, b) => a.priceCents - b.priceCents)
    case 'price-desc':
      return listings.sort((a, b) => b.priceCents - a.priceCents)
    case 'distance':
      return origin
        ? listings.sort((a, b) => distanceKm(origin, a.location) - distanceKm(origin, b.location) || byRecent(a, b))
        : listings.sort(byRecent)
    case 'recent':
      return listings.sort(byRecent)
    case 'relevance': {
      if (tokens.length === 0) return listings.sort(byRecent)
      const scores = new Map(listings.map((listing) => [listing, scoreDocument(getDocument(listing), tokens)]))
      return listings.sort((a, b) => (scores.get(b) ?? 0) - (scores.get(a) ?? 0) || byRecent(a, b))
    }
  }
}

/** Funzione pura (facile da testare): filtra e ordina. */
export function searchListings(listings: readonly Listing[], filters: ListingFilters): Listing[] {
  const context = createContext(filters)
  return sortListings(
    listings.filter((listing) => matchesFilters(listing, filters, context)),
    filters.sort,
    context,
  )
}

export function countMatches(listings: readonly Listing[], filters: ListingFilters): number {
  const context = createContext(filters)
  return listings.reduce((count, listing) => count + (matchesFilters(listing, filters, context) ? 1 : 0), 0)
}

/**
 * Conteggi per opzione di un gruppo di filtri, calcolati ignorando il gruppo stesso
 * (come i portali verticali: "Carbonio (3)" resta visibile anche se hai scelto "Alluminio").
 */
export function countFacet<T extends string>(
  listings: readonly Listing[],
  filters: ListingFilters,
  facet: FacetKey,
  getValues: (listing: Listing) => readonly T[],
): Map<T, number> {
  const context = createContext(filters)
  const counts = new Map<T, number>()
  for (const listing of listings) {
    if (!matchesFilters(listing, filters, context, facet)) continue
    for (const value of getValues(listing)) counts.set(value, (counts.get(value) ?? 0) + 1)
  }
  return counts
}

export function isEmptyAttributeFilter(value: AttributeFilterValue): boolean {
  if (value === true) return false
  if (Array.isArray(value)) return value.length === 0
  return value.min === null && value.max === null
}

/**
 * Mantiene i filtri coerenti fra loro: la sottocategoria deve appartenere allo sport,
 * gli attributi alla sottocategoria, le condizioni hanno senso solo se l'usato è incluso.
 */
export function normalizeFilters(filters: ListingFilters): ListingFilters {
  let { sport, subcategory } = filters

  if (subcategory) {
    const definition = getSubcategory(subcategory)
    const conflicts =
      (sport !== null && definition.sportId !== sport) ||
      (filters.category !== null && definition.categoryId !== filters.category)
    if (conflicts) subcategory = null
    else sport = definition.sportId
  }

  const allowedAttributes = new Set<AttributeKey>(subcategory ? getSubcategory(subcategory).attributes : [])
  const attributes: AttributeFilters = {}
  for (const [key, value] of Object.entries(filters.attributes)) {
    const attributeKey = key as AttributeKey
    if (value !== undefined && allowedAttributes.has(attributeKey) && !isEmptyAttributeFilter(value)) {
      attributes[attributeKey] = value
    }
  }

  const includesUsed = filters.offerGroups.length === 0 || filters.offerGroups.includes('usato')

  return { ...filters, sport, subcategory, attributes, conditions: includesUsed ? filters.conditions : [] }
}

export interface FilterChip {
  id: string
  facet: FacetKey
  label: string
  remove: (filters: ListingFilters) => ListingFilters
}

const euroFormat = (value: number) => formatPrice(value * 100)

function formatRange({ min, max }: NumberRange, format: (value: number) => string): string {
  if (min !== null && max !== null) return `${format(min)}–${format(max)}`
  if (min !== null) return `da ${format(min)}`
  return `fino a ${format(max ?? 0)}`
}

function without<T>(values: readonly T[], value: T): T[] {
  return values.filter((item) => item !== value)
}

/** Etichette dei filtri attivi (chip rimovibili, conteggio, suggerimenti). */
export function getFilterChips(filters: ListingFilters): FilterChip[] {
  const chips: FilterChip[] = []
  const query = filters.query.trim()
  const location = filters.location.trim()
  const model = filters.model.trim()

  if (query) chips.push({ id: 'query', facet: 'query', label: `“${query}”`, remove: (f) => ({ ...f, query: '' }) })
  if (filters.sport) {
    chips.push({ id: 'sport', facet: 'sport', label: getSport(filters.sport).label, remove: (f) => ({ ...f, sport: null }) })
  }
  if (filters.category) {
    chips.push({
      id: 'category',
      facet: 'category',
      label: getCategory(filters.category).label,
      remove: (f) => ({ ...f, category: null }),
    })
  }
  if (filters.subcategory) {
    chips.push({
      id: 'subcategory',
      facet: 'subcategory',
      label: getSubcategory(filters.subcategory).label,
      remove: (f) => ({ ...f, subcategory: null }),
    })
  }
  for (const group of filters.offerGroups) {
    chips.push({
      id: `offer:${group}`,
      facet: 'offerGroups',
      label: getOfferGroup(group).label,
      remove: (f) => ({ ...f, offerGroups: without(f.offerGroups, group) }),
    })
  }
  for (const condition of filters.conditions) {
    chips.push({
      id: `condition:${condition}`,
      facet: 'conditions',
      label: `Usato: ${getCondition(condition).label.toLowerCase()}`,
      remove: (f) => ({ ...f, conditions: without(f.conditions, condition) }),
    })
  }
  if (filters.priceMin !== null || filters.priceMax !== null) {
    chips.push({
      id: 'price',
      facet: 'price',
      label: `Prezzo ${formatRange({ min: filters.priceMin, max: filters.priceMax }, euroFormat)}`,
      remove: (f) => ({ ...f, priceMin: null, priceMax: null }),
    })
  }
  if (location) {
    chips.push({
      id: 'location',
      facet: 'location',
      label: filters.radiusKm !== null ? `${location} · entro ${filters.radiusKm} km` : location,
      remove: (f) => ({ ...f, location: '', radiusKm: null }),
    })
  }
  for (const kind of filters.sellerKinds) {
    chips.push({
      id: `seller:${kind}`,
      facet: 'sellerKinds',
      label: `Solo ${SELLER_KINDS.find((item) => item.id === kind)?.pluralLabel.toLowerCase() ?? kind}`,
      remove: (f) => ({ ...f, sellerKinds: without(f.sellerKinds, kind) }),
    })
  }
  for (const mode of filters.deliveryModes) {
    chips.push({
      id: `delivery:${mode}`,
      facet: 'deliveryModes',
      label: DELIVERY_MODES.find((item) => item.id === mode)?.label ?? mode,
      remove: (f) => ({ ...f, deliveryModes: without(f.deliveryModes, mode) }),
    })
  }
  if (filters.onlyAvailable) {
    chips.push({
      id: 'available',
      facet: 'onlyAvailable',
      label: 'Solo disponibili',
      remove: (f) => ({ ...f, onlyAvailable: false }),
    })
  }
  for (const brand of filters.brands) {
    chips.push({
      id: `brand:${brand}`,
      facet: 'brands',
      label: brand,
      remove: (f) => ({ ...f, brands: without(f.brands, brand) }),
    })
  }
  if (model) chips.push({ id: 'model', facet: 'model', label: `Modello: ${model}`, remove: (f) => ({ ...f, model: '' }) })

  for (const [key, value] of Object.entries(filters.attributes)) {
    if (value === undefined) continue
    const attributeKey = key as AttributeKey
    const definition = getAttribute(attributeKey)
    const facet: FacetKey = `attr:${attributeKey}`
    const removeAttribute = (f: ListingFilters): ListingFilters => {
      const attributes = { ...f.attributes }
      delete attributes[attributeKey]
      return { ...f, attributes }
    }

    if (value === true) {
      chips.push({ id: facet, facet, label: definition.label, remove: removeAttribute })
    } else if (Array.isArray(value)) {
      for (const option of value) {
        chips.push({
          id: `${facet}:${option}`,
          facet,
          label: `${definition.label}: ${formatAttributeValue(definition, option)}`,
          remove: (f) => {
            const current = f.attributes[attributeKey]
            const rest = Array.isArray(current) ? without(current, option) : []
            return { ...f, attributes: { ...f.attributes, [attributeKey]: rest } }
          },
        })
      }
    } else if (definition.kind === 'number') {
      chips.push({
        id: facet,
        facet,
        label: `${definition.label} ${formatRange(value, (n) => formatAttributeValue(definition, n))}`,
        remove: removeAttribute,
      })
    }
  }
  return chips
}

export interface RelaxSuggestion {
  chip: FilterChip
  count: number
}

/** Ricerca senza risultati: quali filtri, se tolti, riportano annunci (e quanti). */
export function getRelaxSuggestions(listings: readonly Listing[], filters: ListingFilters, limit = 3): RelaxSuggestion[] {
  return getFilterChips(filters)
    .map((chip) => ({ chip, count: countMatches(listings, normalizeFilters(chip.remove(filters))) }))
    .filter((suggestion) => suggestion.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export function countBySport(listings: readonly Listing[]): Partial<Record<SportId, number>> {
  const counts: Partial<Record<SportId, number>> = {}
  for (const listing of listings) {
    if (listing.status === 'venduto') continue
    counts[listing.sportId] = (counts[listing.sportId] ?? 0) + 1
  }
  return counts
}
