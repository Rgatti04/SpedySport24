import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import type { AttributeFilterValue, AttributeKey, ListingFilters } from '@/types'
import { DEFAULT_FILTERS, getFilterChips, normalizeFilters } from '../lib/filterListings'
import { parseFilters, serializeFilters } from '../lib/filtersUrl'

export type SetFilter = <K extends keyof ListingFilters>(key: K, value: ListingFilters[K]) => void
export type SetAttributeFilter = (key: AttributeKey, value: AttributeFilterValue | null) => void
export type UpdateFilters = (update: (current: ListingFilters) => ListingFilters) => void

/**
 * Stato della ricerca con l'URL come unica fonte di verità: ogni ricerca è condivisibile,
 * sopravvive al refresh e funziona con avanti/indietro del browser.
 */
export function useListingFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo(() => parseFilters(searchParams), [searchParams])

  const updateFilters = useCallback<UpdateFilters>(
    (update) => {
      setSearchParams((current) => serializeFilters(normalizeFilters(update(parseFilters(current)))), {
        replace: true,
        preventScrollReset: true,
      })
    },
    [setSearchParams],
  )

  const setFilter = useCallback<SetFilter>(
    (key, value) => updateFilters((current) => ({ ...current, [key]: value })),
    [updateFilters],
  )

  const setAttributeFilter = useCallback<SetAttributeFilter>(
    (key, value) =>
      updateFilters((current) => {
        const attributes = { ...current.attributes }
        if (value === null) delete attributes[key]
        else attributes[key] = value
        return { ...current, attributes }
      }),
    [updateFilters],
  )

  const resetFilters = useCallback(
    () => updateFilters((current) => ({ ...DEFAULT_FILTERS, sort: current.sort })),
    [updateFilters],
  )

  const chips = useMemo(() => getFilterChips(filters), [filters])

  return { filters, chips, setFilter, setAttributeFilter, updateFilters, resetFilters }
}
