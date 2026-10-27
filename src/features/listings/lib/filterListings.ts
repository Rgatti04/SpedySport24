import { getCategory, getSport } from '@/config/taxonomy'
import { normalizeText, tokenize } from '@/lib/text'
import type { Listing, ListingFilters, SortOption, SportId } from '@/types'

export const DEFAULT_FILTERS: ListingFilters = {
  query: '',
  sport: null,
  category: null,
  location: '',
  fastShippingOnly: false,
  sort: 'recent',
}

export const SORT_OPTIONS: readonly { value: SortOption; label: string }[] = [
  { value: 'recent', label: 'Più recenti' },
  { value: 'price-asc', label: 'Prezzo crescente' },
  { value: 'price-desc', label: 'Prezzo decrescente' },
]

export function isSortOption(value: unknown): value is SortOption {
  return SORT_OPTIONS.some((option) => option.value === value)
}

const searchIndex = new WeakMap<Listing, string>()

function getSearchableText(listing: Listing): string {
  let text = searchIndex.get(listing)
  if (text === undefined) {
    text = normalizeText(
      [
        listing.title,
        listing.brand,
        listing.description,
        getSport(listing.sportId).label,
        getCategory(listing.categoryId).label,
      ].join(' '),
    )
    searchIndex.set(listing, text)
  }
  return text
}

/** Accetta città ("mil"), sigla provincia ("MI"), regione ("lomb") o CAP anche parziale ("201"). */
function matchesLocation(listing: Listing, rawLocation: string): boolean {
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

const COMPARATORS: Record<SortOption, (a: Listing, b: Listing) => number> = {
  recent: (a, b) => b.createdAt.localeCompare(a.createdAt),
  'price-asc': (a, b) => a.priceCents - b.priceCents,
  'price-desc': (a, b) => b.priceCents - a.priceCents,
}

/** Funzione pura (facile da testare): filtra e ordina. */
export function filterListings(listings: readonly Listing[], filters: ListingFilters): Listing[] {
  const tokens = tokenize(filters.query)

  return listings
    .filter(
      (listing) =>
        (!filters.sport || listing.sportId === filters.sport) &&
        (!filters.category || listing.categoryId === filters.category) &&
        (!filters.fastShippingOnly || listing.hasFastShipping) &&
        matchesLocation(listing, filters.location) &&
        tokens.every((token) => getSearchableText(listing).includes(token)),
    )
    .sort(COMPARATORS[filters.sort])
}

export function countActiveFilters(filters: ListingFilters): number {
  return [
    filters.query.trim() !== '',
    filters.sport !== null,
    filters.category !== null,
    filters.location.trim() !== '',
    filters.fastShippingOnly,
  ].filter(Boolean).length
}

export function countBySport(listings: readonly Listing[]): Partial<Record<SportId, number>> {
  const counts: Partial<Record<SportId, number>> = {}
  for (const listing of listings) {
    counts[listing.sportId] = (counts[listing.sportId] ?? 0) + 1
  }
  return counts
}

export function getCitySuggestions(listings: readonly Listing[]): string[] {
  return [...new Set(listings.map((listing) => listing.location.city))].sort((a, b) =>
    a.localeCompare(b, 'it'),
  )
}
