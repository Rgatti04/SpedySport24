import { useCallback, useMemo, useState } from 'react'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { Toast } from '@/components/ui/Toast'
import { HeroSection } from '@/features/home/components/HeroSection'
import { SellCtaBanner } from '@/features/home/components/SellCtaBanner'
import { SportCategoriesSection } from '@/features/home/components/SportCategoriesSection'
import { ListingDetailModal } from '@/features/listings/components/ListingDetailModal'
import { ListingsSection } from '@/features/listings/components/ListingsSection'
import { useFavorites } from '@/features/listings/hooks/useFavorites'
import { useFilteredListings } from '@/features/listings/hooks/useFilteredListings'
import { useListingFilters } from '@/features/listings/hooks/useListingFilters'
import { useListings } from '@/features/listings/hooks/useListings'
import { countBySport, getCitySuggestions } from '@/features/listings/lib/filterListings'
import { scrollToSection } from '@/lib/dom'
import type { Listing, SportId } from '@/types'

const RESULTS_SECTION_ID = 'annunci'

export function HomePage() {
  const { listings, status, retry } = useListings()
  const { filters, setFilter, resetFilters } = useListingFilters()
  const { results, isUpdating } = useFilteredListings(listings, filters)
  const { isFavorite, toggleFavorite } = useFavorites()

  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const countsBySport = useMemo(() => (status === 'success' ? countBySport(listings) : null), [listings, status])
  const citySuggestions = useMemo(() => getCitySuggestions(listings), [listings])

  const dismissToast = useCallback(() => setToast(null), [])
  const showResults = useCallback(() => scrollToSection(RESULTS_SECTION_ID), [])

  const openListing = useCallback((listing: Listing) => {
    setSelectedListing(listing)
    setIsDetailOpen(true)
  }, [])

  function handleSelectSport(sport: SportId | null) {
    setFilter('sport', sport)
    if (sport) showResults()
  }

  return (
    <>
      <a
        href={`#${RESULTS_SECTION_ID}`}
        className="sr-only rounded-lg bg-accent-500 px-4 py-2 font-semibold text-brand-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-70"
      >
        Vai agli annunci
      </a>

      <Header
        searchQuery={filters.query}
        onSearchChange={(query) => setFilter('query', query)}
        onSearchSubmit={showResults}
        onLoginClick={() => setToast('L’accesso con email, Google e Apple arriverà nella prossima release.')}
        onSellClick={() => setToast('Il flusso “Vendi Usato” è in sviluppo: presto potrai pubblicare in 2 minuti.')}
      />

      <main>
        <HeroSection
          filters={filters}
          onFilterChange={setFilter}
          citySuggestions={citySuggestions}
          onSubmit={showResults}
        />
        <SportCategoriesSection
          selectedSport={filters.sport}
          countsBySport={countsBySport}
          onSelectSport={handleSelectSport}
        />
        <ListingsSection
          id={RESULTS_SECTION_ID}
          status={status}
          listings={results}
          isUpdating={isUpdating}
          filters={filters}
          onFilterChange={setFilter}
          onResetFilters={resetFilters}
          onRetry={retry}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onOpenListing={openListing}
        />
        <SellCtaBanner
          onSellClick={() => setToast('Il flusso “Vendi Usato” è in sviluppo: presto potrai pubblicare in 2 minuti.')}
        />
      </main>

      <Footer />

      <ListingDetailModal
        listing={selectedListing}
        open={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        isFavorite={selectedListing ? isFavorite(selectedListing.id) : false}
        onToggleFavorite={toggleFavorite}
      />

      <Toast message={toast} onDismiss={dismissToast} />
    </>
  )
}
