import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { cn } from '@/lib/cn'
import type { GeoPoint, Listing } from '@/types'
import { useFavorites } from '../hooks/useFavorites'
import { getListingDistance } from '../lib/filterListings'
import { ListingCard, ListingCardSkeleton } from './ListingCard'

const DESKTOP_VISIBLE = 4

interface ListingRailProps {
  id: string
  title: string
  description?: ReactNode
  listings: readonly Listing[]
  isLoading: boolean
  seeAllTo?: string
  seeAllLabel?: string
  origin?: GeoPoint | null
  /** Contenuto alternativo quando non ci sono annunci (o al posto dell'elenco). */
  emptyState?: ReactNode
  actions?: ReactNode
}

/** Selezione orizzontale di annunci: carosello a scorrimento su mobile, griglia a 4 colonne su desktop. */
export function ListingRail({
  id,
  title,
  description,
  listings,
  isLoading,
  seeAllTo,
  seeAllLabel = 'Vedi tutti',
  origin = null,
  emptyState,
  actions,
}: ListingRailProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const showEmpty = !isLoading && listings.length === 0 && emptyState

  return (
    <section aria-labelledby={`${id}-title`} className="container-page pt-14 sm:pt-20">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="min-w-0">
          <h2 id={`${id}-title`} className="font-display text-2xl font-bold italic tracking-tight text-ink sm:text-3xl">
            {title}
          </h2>
          {description && <div className="mt-1 text-sm text-slate-600 sm:text-base">{description}</div>}
        </div>
        <div className="flex items-center gap-3">
          {actions}
          {seeAllTo && listings.length > 0 && (
            <Link
              to={seeAllTo}
              className="inline-flex shrink-0 items-center gap-1 rounded-md text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
            >
              {seeAllLabel}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>

      {showEmpty ? (
        <div className="mt-6">{emptyState}</div>
      ) : (
        <ul className="-mx-4 mt-6 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-3 pt-1 scrollbar-none sm:-mx-6 sm:scroll-px-6 sm:gap-5 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
          {isLoading
            ? Array.from({ length: 4 }, (_, index) => (
                <li key={index} className="w-[62%] shrink-0 snap-start sm:w-[40%] md:w-[30%] lg:w-auto">
                  <ListingCardSkeleton />
                </li>
              ))
            : listings.map((listing, index) => (
                <li
                  key={listing.id}
                  className={cn(
                    'w-[62%] shrink-0 snap-start sm:w-[40%] md:w-[30%] lg:w-auto',
                    // Su desktop una sola riga: il resto è a un clic con "Vedi tutti".
                    index >= DESKTOP_VISIBLE && 'lg:hidden',
                  )}
                >
                  <ListingCard
                    listing={listing}
                    isFavorite={isFavorite(listing.id)}
                    onToggleFavorite={toggleFavorite}
                    distanceKm={getListingDistance(listing, origin)}
                    sizes="(min-width: 1024px) 300px, (min-width: 640px) 40vw, 62vw"
                  />
                </li>
              ))}
        </ul>
      )}
    </section>
  )
}
