import { getAttribute } from '@/config/attributes'
import {
  isCategoryId,
  isConditionId,
  isDeliveryMode,
  isOfferGroupId,
  isSellerKind,
  isSportId,
  isSubcategoryId,
  getSubcategory,
} from '@/config/taxonomy'
import type { AttributeFilters, ListingFilters, NumberRange } from '@/types'
import { DEFAULT_FILTERS, isSortOption, normalizeFilters } from './filterListings'

/**
 * Nomi dei parametri URL, in italiano e leggibili: le ricerche sono condivisibili e indicizzabili
 * (/cerca?sport=ciclismo&sottocategoria=biciclette&taglia-telaio=m&prezzo-max=1500).
 * Gli attributi tecnici usano direttamente la propria chiave come parametro.
 */
const PARAMS = {
  query: 'q',
  sport: 'sport',
  category: 'categoria',
  subcategory: 'sottocategoria',
  offerGroups: 'tipo',
  conditions: 'condizioni',
  priceMin: 'prezzo-min',
  priceMax: 'prezzo-max',
  location: 'luogo',
  radiusKm: 'raggio',
  sellerKinds: 'venditore',
  deliveryModes: 'consegna',
  onlyAvailable: 'disponibili',
  brands: 'marca',
  model: 'modello',
  sort: 'ordina',
} as const satisfies Record<Exclude<keyof ListingFilters, 'attributes'>, string>

export const SEARCH_PATH = '/cerca'

function readList<T extends string>(params: URLSearchParams, name: string, guard: (value: unknown) => value is T): T[] {
  return [...new Set(params.getAll(name).filter(guard))]
}

function readNumber(params: URLSearchParams, name: string): number | null {
  const raw = params.get(name)?.trim()
  if (!raw) return null
  const value = Number(raw)
  return Number.isFinite(value) && value >= 0 ? Math.round(value) : null
}

const RANGE_PATTERN = /^(\d+(?:\.\d+)?)?-(\d+(?:\.\d+)?)?$/

function readRange(raw: string | null): NumberRange | null {
  const match = raw ? RANGE_PATTERN.exec(raw) : null
  if (!match || (!match[1] && !match[2])) return null
  return { min: match[1] ? Number(match[1]) : null, max: match[2] ? Number(match[2]) : null }
}

function writeRange({ min, max }: NumberRange): string {
  return `${min ?? ''}-${max ?? ''}`
}

export function parseFilters(params: URLSearchParams): ListingFilters {
  const sport = params.get(PARAMS.sport)
  const category = params.get(PARAMS.category)
  const subcategory = params.get(PARAMS.subcategory)
  const sort = params.get(PARAMS.sort)

  const attributes: AttributeFilters = {}
  if (isSubcategoryId(subcategory)) {
    for (const key of getSubcategory(subcategory).attributes) {
      const definition = getAttribute(key)
      if (definition.kind === 'enum') {
        const allowed = new Set(definition.options.map((option) => option.value))
        const values = params.getAll(key).filter((value) => allowed.has(value))
        if (values.length > 0) attributes[key] = [...new Set(values)]
      } else if (definition.kind === 'number') {
        const range = readRange(params.get(key))
        if (range) attributes[key] = range
      } else if (params.get(key) === '1') {
        attributes[key] = true
      }
    }
  }

  return normalizeFilters({
    query: params.get(PARAMS.query) ?? '',
    sport: isSportId(sport) ? sport : null,
    category: isCategoryId(category) ? category : null,
    subcategory: isSubcategoryId(subcategory) ? subcategory : null,
    offerGroups: readList(params, PARAMS.offerGroups, isOfferGroupId),
    conditions: readList(params, PARAMS.conditions, isConditionId),
    priceMin: readNumber(params, PARAMS.priceMin),
    priceMax: readNumber(params, PARAMS.priceMax),
    location: params.get(PARAMS.location) ?? '',
    radiusKm: readNumber(params, PARAMS.radiusKm),
    sellerKinds: readList(params, PARAMS.sellerKinds, isSellerKind),
    deliveryModes: readList(params, PARAMS.deliveryModes, isDeliveryMode),
    onlyAvailable: params.get(PARAMS.onlyAvailable) === '1',
    brands: [...new Set(params.getAll(PARAMS.brands).filter(Boolean))],
    model: params.get(PARAMS.model) ?? '',
    attributes,
    sort: isSortOption(sort) ? sort : DEFAULT_FILTERS.sort,
  })
}

export function serializeFilters(filters: ListingFilters): URLSearchParams {
  const params = new URLSearchParams()
  const setIf = (name: string, value: string | null | false) => {
    if (value) params.set(name, value)
  }
  const appendAll = (name: string, values: readonly string[]) => {
    for (const value of values) params.append(name, value)
  }

  setIf(PARAMS.query, filters.query.trim())
  setIf(PARAMS.sport, filters.sport)
  setIf(PARAMS.category, filters.category)
  setIf(PARAMS.subcategory, filters.subcategory)
  appendAll(PARAMS.offerGroups, filters.offerGroups)
  appendAll(PARAMS.conditions, filters.conditions)
  setIf(PARAMS.priceMin, filters.priceMin !== null && String(filters.priceMin))
  setIf(PARAMS.priceMax, filters.priceMax !== null && String(filters.priceMax))
  setIf(PARAMS.location, filters.location.trim())
  setIf(PARAMS.radiusKm, filters.radiusKm !== null && String(filters.radiusKm))
  appendAll(PARAMS.sellerKinds, filters.sellerKinds)
  appendAll(PARAMS.deliveryModes, filters.deliveryModes)
  setIf(PARAMS.onlyAvailable, filters.onlyAvailable && '1')
  appendAll(PARAMS.brands, filters.brands)
  setIf(PARAMS.model, filters.model.trim())

  for (const [key, value] of Object.entries(filters.attributes)) {
    if (value === undefined) continue
    if (value === true) params.set(key, '1')
    else if (Array.isArray(value)) appendAll(key, value)
    else params.set(key, writeRange(value))
  }

  if (filters.sort !== DEFAULT_FILTERS.sort) params.set(PARAMS.sort, filters.sort)
  return params
}

/** Link alla pagina di ricerca con i filtri indicati (gli altri restano ai valori predefiniti). */
export function buildSearchPath(filters: Partial<ListingFilters> = {}): string {
  const search = serializeFilters(normalizeFilters({ ...DEFAULT_FILTERS, ...filters })).toString()
  return search ? `${SEARCH_PATH}?${search}` : SEARCH_PATH
}
