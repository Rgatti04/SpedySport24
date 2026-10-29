import { AlertTriangle, RotateCcw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { buildSearchPath } from '@/app/paths'
import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs'
import { Button } from '@/components/ui/Button'
import { resolvePlace } from '@/config/places'
import { getOfferGroup, getSport, getSubcategory } from '@/config/taxonomy'
import { ListingGrid, ListingGridSkeleton } from '@/features/listings/components/ListingGrid'
import { useFilteredListings } from '@/features/listings/hooks/useFilteredListings'
import { useListingFilters } from '@/features/listings/hooks/useListingFilters'
import { useListings } from '@/features/listings/hooks/useListings'
import { getRelaxSuggestions, normalizeFilters } from '@/features/listings/lib/filterListings'
import { FiltersPanel } from '@/features/search/components/FiltersPanel'
import { MobileFiltersDialog } from '@/features/search/components/MobileFiltersDialog'
import { NoResults } from '@/features/search/components/NoResults'
import { OfferQuickBar } from '@/features/search/components/OfferQuickBar'
import { ResultsToolbar } from '@/features/search/components/ResultsToolbar'
import { pluralize } from '@/lib/format'
import { usePageMeta } from '@/lib/hooks'
import type { ListingFilters } from '@/types'

const PAGE_SIZE = 12

function getTitle(filters: ListingFilters): string {
  const query = filters.query.trim()
  if (filters.subcategory) return getSubcategory(filters.subcategory).label
  if (filters.sport) return `Attrezzatura ${getSport(filters.sport).label}`
  if (query) return `Risultati per “${query}”`
  if (filters.offerGroups.length === 1) return getOfferGroup(filters.offerGroups[0]!).label
  if (filters.sellerKinds.length === 1) return filters.sellerKinds[0] === 'negozio' ? 'Offerte dei negozi' : 'Annunci dei privati'
  return 'Tutti gli annunci'
}

function getBreadcrumbs(filters: ListingFilters): Crumb[] {
  const crumbs: Crumb[] = [{ label: 'Home', to: '/' }, { label: 'Cerca', to: buildSearchPath() }]
  if (filters.sport) crumbs.push({ label: getSport(filters.sport).label, to: buildSearchPath({ sport: filters.sport }) })
  if (filters.subcategory) crumbs.push({ label: getSubcategory(filters.subcategory).label })
  return crumbs
}

export function SearchPage() {
  const { listings, status, retry } = useListings()
  const { filters, chips, setFilter, setAttributeFilter, updateFilters, resetFilters } = useListingFilters()
  const { results, isUpdating } = useFilteredListings(listings, filters)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [previousResults, setPreviousResults] = useState(results)

  // Nuovi risultati (filtri cambiati) → si riparte dalla prima "pagina".
  if (results !== previousResults) {
    setPreviousResults(results)
    setVisibleCount(PAGE_SIZE)
  }

  const origin = useMemo(() => resolvePlace(filters.location), [filters.location])
  const title = getTitle(filters)
  const isLoading = status === 'loading'
  const visibleResults = results.slice(0, visibleCount)
  const remaining = results.length - visibleResults.length
  const suggestions = useMemo(
    () => (status === 'success' && results.length === 0 ? getRelaxSuggestions(listings, filters) : []),
    [status, results.length, listings, filters],
  )

  usePageMeta(title, `${title}: attrezzatura sportiva nuova, fine serie e usata da negozi e privati.`)

  const panelProps = { catalog: listings, filters, setFilter, setAttributeFilter, updateFilters }
  const applyChipRemoval = (remove: (current: ListingFilters) => ListingFilters) =>
    updateFilters((current) => normalizeFilters(remove(current)))

  return (
    <div className="container-page py-6 sm:py-10">
      <Breadcrumbs items={getBreadcrumbs(filters)} />
      <h1 className="mt-3 font-display text-3xl font-bold italic tracking-tight text-ink sm:text-4xl">{title}</h1>
      <p className="mt-1 text-sm text-slate-600 sm:text-base">
        {isLoading
          ? 'Stiamo cercando tra gli annunci di negozi e privati…'
          : [
              pluralize(results.length, 'annuncio', 'annunci'),
              filters.offerGroups.length === 0 ? ' tra nuovo, fine serie e usato' : '',
              origin && filters.radiusKm ? `, entro ${filters.radiusKm} km da ${origin.city}` : '',
              '.',
            ].join('')}
      </p>

      <div className="mt-5">
        <OfferQuickBar catalog={listings} filters={filters} setFilter={setFilter} />
      </div>

      <div className="mt-6 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-8 xl:grid-cols-[18rem_minmax(0,1fr)]">
        <aside aria-label="Filtri di ricerca" className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto overscroll-contain rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
            <FiltersPanel idPrefix="side" {...panelProps} />
          </div>
        </aside>

        <section aria-label="Risultati" className="min-w-0">
          <ResultsToolbar
            resultCount={results.length}
            isLoading={isLoading}
            sort={filters.sort}
            canSortByDistance={origin !== null}
            chips={chips}
            onSortChange={(sort) => setFilter('sort', sort)}
            onRemoveChip={(chip) => applyChipRemoval(chip.remove)}
            onReset={resetFilters}
            onOpenFilters={() => setIsFiltersOpen(true)}
          />

          <div className="mt-5">
            {isLoading && <ListingGridSkeleton layout="withSidebar" count={6} />}

            {status === 'error' && (
              <div className="flex flex-col items-center rounded-3xl border-2 border-dashed border-slate-200 bg-white px-6 py-14 text-center">
                <AlertTriangle className="size-8 text-brand-600" aria-hidden="true" />
                <p className="mt-3 font-semibold text-ink">Non siamo riusciti a caricare gli annunci</p>
                <p className="mt-1 text-sm text-slate-600">Controlla la connessione e riprova tra qualche istante.</p>
                <Button className="mt-5" onClick={retry}>
                  <RotateCcw className="size-4" aria-hidden="true" />
                  Riprova
                </Button>
              </div>
            )}

            {status === 'success' && results.length === 0 && (
              <NoResults
                suggestions={suggestions}
                onApply={(chip) => applyChipRemoval(chip.remove)}
                onReset={resetFilters}
              />
            )}

            {status === 'success' && results.length > 0 && (
              <>
                <ListingGrid listings={visibleResults} origin={origin} layout="withSidebar" isUpdating={isUpdating} />
                {remaining > 0 && (
                  <div className="mt-10 flex flex-col items-center gap-3">
                    <p className="text-sm text-slate-600">
                      Hai visto {visibleResults.length} di {results.length} annunci
                    </p>
                    <Button variant="outline" size="lg" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
                      Mostra altri {Math.min(remaining, PAGE_SIZE)} annunci
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      <MobileFiltersDialog
        open={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        resultCount={results.length}
        activeCount={chips.length}
        onReset={resetFilters}
      >
        <FiltersPanel idPrefix="drawer" {...panelProps} />
      </MobileFiltersDialog>
    </div>
  )
}
