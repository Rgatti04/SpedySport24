import { useCallback, useEffect, useState } from 'react'
import { isCategoryId, isSportId } from '@/config/taxonomy'
import type { ListingFilters } from '@/types'
import { countActiveFilters, DEFAULT_FILTERS, isSortOption } from '../lib/filterListings'

export type SetFilter = <K extends keyof ListingFilters>(key: K, value: ListingFilters[K]) => void

/** Nomi dei parametri URL (in italiano, condivisibili: /?sport=calcio&luogo=milano). */
const PARAMS = {
  query: 'q',
  sport: 'sport',
  category: 'categoria',
  location: 'luogo',
  fastShippingOnly: 'spedizione24h',
  sort: 'ordina',
} as const satisfies Record<keyof ListingFilters, string>

function readFiltersFromUrl(): ListingFilters {
  const params = new URLSearchParams(window.location.search)
  const sport = params.get(PARAMS.sport)
  const category = params.get(PARAMS.category)
  const sort = params.get(PARAMS.sort)

  return {
    query: params.get(PARAMS.query) ?? '',
    sport: isSportId(sport) ? sport : null,
    category: isCategoryId(category) ? category : null,
    location: params.get(PARAMS.location) ?? '',
    fastShippingOnly: params.get(PARAMS.fastShippingOnly) === '1',
    sort: isSortOption(sort) ? sort : DEFAULT_FILTERS.sort,
  }
}

function writeFiltersToUrl(filters: ListingFilters) {
  const params = new URLSearchParams()
  if (filters.query.trim()) params.set(PARAMS.query, filters.query.trim())
  if (filters.sport) params.set(PARAMS.sport, filters.sport)
  if (filters.category) params.set(PARAMS.category, filters.category)
  if (filters.location.trim()) params.set(PARAMS.location, filters.location.trim())
  if (filters.fastShippingOnly) params.set(PARAMS.fastShippingOnly, '1')
  if (filters.sort !== DEFAULT_FILTERS.sort) params.set(PARAMS.sort, filters.sort)

  const search = params.toString()
  const url = `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`
  window.history.replaceState(window.history.state, '', url)
}

/**
 * Stato dei filtri (unica fonte di verità per header, hero, categorie e griglia),
 * sincronizzato con la query string per ricerche condivisibili.
 */
export function useListingFilters() {
  const [filters, setFilters] = useState<ListingFilters>(readFiltersFromUrl)

  useEffect(() => {
    writeFiltersToUrl(filters)
  }, [filters])

  const setFilter = useCallback<SetFilter>((key, value) => {
    setFilters((prev) => (prev[key] === value ? prev : { ...prev, [key]: value }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters((prev) => ({ ...DEFAULT_FILTERS, sort: prev.sort }))
  }, [])

  return {
    filters,
    setFilter,
    resetFilters,
    activeFilterCount: countActiveFilters(filters),
  }
}
