import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/cn'
import type { GeoPoint, Listing } from '@/types'
import { useFavorites } from '../hooks/useFavorites'
import { getListingDistance } from '../lib/filterListings'
import { ListingCard, ListingCardSkeleton } from './ListingCard'

const GRID_CLASSES = {
  /** Pagina con colonna filtri a lato. */
  withSidebar: 'grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3',
  full: 'grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4',
} as const

interface ListingGridProps {
  listings: readonly Listing[]
  /** Punto da cui calcolare la distanza mostrata nelle card. */
  origin?: GeoPoint | null
  layout?: keyof typeof GRID_CLASSES
  isUpdating?: boolean
}

export function ListingGrid({ listings, origin = null, layout = 'full', isUpdating = false }: ListingGridProps) {
  const { isFavorite, toggleFavorite } = useFavorites()

  return (
    <ul className={cn(GRID_CLASSES[layout], 'transition-opacity', isUpdating && 'opacity-70')}>
      <AnimatePresence mode="popLayout">
        {listings.map((listing) => (
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
              onToggleFavorite={toggleFavorite}
              distanceKm={getListingDistance(listing, origin)}
            />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  )
}

export function ListingGridSkeleton({ count = 8, layout = 'full' }: { count?: number; layout?: keyof typeof GRID_CLASSES }) {
  return (
    <div className={GRID_CLASSES[layout]} aria-busy="true" aria-label="Caricamento annunci">
      {Array.from({ length: count }, (_, index) => (
        <ListingCardSkeleton key={index} />
      ))}
    </div>
  )
}
