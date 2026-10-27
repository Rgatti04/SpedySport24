import { useDeferredValue, useMemo } from 'react'
import type { Listing, ListingFilters } from '@/types'
import { filterListings } from '../lib/filterListings'

/**
 * Applica i filtri in tempo reale. `useDeferredValue` mantiene l'input reattivo
 * mentre la griglia si aggiorna (alternativa nativa al debounce).
 */
export function useFilteredListings(listings: readonly Listing[], filters: ListingFilters) {
  const deferredFilters = useDeferredValue(filters)
  const results = useMemo(() => filterListings(listings, deferredFilters), [listings, deferredFilters])

  return { results, isUpdating: deferredFilters !== filters }
}
