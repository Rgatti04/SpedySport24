import { AlertTriangle, RotateCcw, SearchX, type LucideIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { getSport } from '@/config/taxonomy'
import { cn } from '@/lib/cn'
import type { Listing, ListingFilters } from '@/types'
import type { RequestStatus } from '../hooks/useListings'
import type { SetFilter } from '../hooks/useListingFilters'
import { ListingCard, ListingCardSkeleton } from './ListingCard'
import { ResultsToolbar } from './ResultsToolbar'

const PAGE_SIZE = 12

function getTitle(filters: ListingFilters): string {
  const query = filters.query.trim()
  if (filters.sport) return `Annunci ${getSport(filters.sport).label}`
  if (query) return `Risultati per “${query}”`
  return 'Ultimi annunci in vetrina'
}

interface ListingsSectionProps {
  id: string
  status: RequestStatus
  listings: Listing[]
  isUpdating: boolean
  filters: ListingFilters
  onFilterChange: SetFilter
  onResetFilters: () => void
  onRetry: () => void
  isFavorite: (id: string) => boolean
  onToggleFavorite: (id: string) => void
  onOpenListing: (listing: Listing) => void
}

export function ListingsSection({
  id,
  status,
  listings,
  isUpdating,
  filters,
  onFilterChange,
  onResetFilters,
  onRetry,
  isFavorite,
  onToggleFavorite,
  onOpenListing,
}: ListingsSectionProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [previousListings, setPreviousListings] = useState(listings)

  // Nuovi risultati (filtri cambiati) → si riparte dalla prima "pagina".
  if (listings !== previousListings) {
    setPreviousListings(listings)
    setVisibleCount(PAGE_SIZE)
  }

  const visibleListings = listings.slice(0, visibleCount)
  const remaining = listings.length - visibleListings.length

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="container-page pt-14 sm:pt-20">
      <div className="mb-6">
        <h2 id={`${id}-title`} className="font-display text-2xl font-bold italic tracking-tight text-ink sm:text-3xl">
          {getTitle(filters)}
        </h2>
        <p className="mt-1 text-sm text-slate-600 sm:text-base">
          Attrezzatura usata e descritta nel dettaglio, pronta per una nuova stagione.
        </p>
      </div>

      <ResultsToolbar
        resultCount={listings.length}
        isLoading={status === 'loading'}
        filters={filters}
        onFilterChange={onFilterChange}
        onReset={onResetFilters}
      />

      <div className="mt-6">
        {status === 'loading' && (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4" aria-busy="true">
            {Array.from({ length: 8 }, (_, index) => (
              <ListingCardSkeleton key={index} />
            ))}
          </div>
        )}

        {status === 'error' && (
          <StateMessage
            icon={AlertTriangle}
            title="Non siamo riusciti a caricare gli annunci"
            text="Controlla la connessione e riprova tra qualche istante."
            action={
              <Button variant="primary" onClick={onRetry}>
                <RotateCcw className="size-4" aria-hidden="true" />
                Riprova
              </Button>
            }
          />
        )}

        {status === 'success' && listings.length === 0 && (
          <StateMessage
            icon={SearchX}
            title="Nessun annuncio trovato"
            text="Prova a modificare i filtri, cercare un termine più generico o ampliare la zona."
            action={
              <Button variant="primary" onClick={onResetFilters}>
                Azzera filtri
              </Button>
            }
          />
        )}

        {status === 'success' && listings.length > 0 && (
          <>
            <ul
              className={cn(
                'grid grid-cols-2 gap-3 transition-opacity sm:gap-5 md:grid-cols-3 xl:grid-cols-4',
                isUpdating && 'opacity-70',
              )}
            >
              <AnimatePresence mode="popLayout">
                {visibleListings.map((listing) => (
                  <motion.li
                    key={listing.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <ListingCard
                      listing={listing}
                      isFavorite={isFavorite(listing.id)}
                      onToggleFavorite={onToggleFavorite}
                      onOpen={onOpenListing}
                    />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            {remaining > 0 && (
              <div className="mt-10 flex flex-col items-center gap-3">
                <p className="text-sm text-slate-600">
                  Hai visto {visibleListings.length} di {listings.length} annunci
                </p>
                <div className="h-1 w-48 overflow-hidden rounded-full bg-slate-200" aria-hidden="true">
                  <div
                    className="h-full rounded-full bg-brand-600 transition-[width] duration-500"
                    style={{ width: `${(visibleListings.length / listings.length) * 100}%` }}
                  />
                </div>
                <Button variant="outline" size="lg" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
                  Mostra altri {Math.min(remaining, PAGE_SIZE)} annunci
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

interface StateMessageProps {
  icon: LucideIcon
  title: string
  text: string
  action: ReactNode
}

function StateMessage({ icon: Icon, title, text, action }: StateMessageProps) {
  return (
    <div className="flex flex-col items-center rounded-3xl border-2 border-dashed border-slate-200 bg-white px-6 py-16 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
        <Icon className="size-7" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-600">{text}</p>
      <div className="mt-6">{action}</div>
    </div>
  )
}
