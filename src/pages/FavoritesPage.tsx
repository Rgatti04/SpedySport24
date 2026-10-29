import { Heart } from 'lucide-react'
import { Link } from 'react-router'
import { SEARCH_PATH } from '@/app/paths'
import { buttonStyles } from '@/components/ui/buttonStyles'
import { ListingGrid, ListingGridSkeleton } from '@/features/listings/components/ListingGrid'
import { useFavorites } from '@/features/listings/hooks/useFavorites'
import { useListings } from '@/features/listings/hooks/useListings'
import { pluralize } from '@/lib/format'
import { usePageMeta } from '@/lib/hooks'

export function FavoritesPage() {
  usePageMeta('Preferiti')
  const { listings, status } = useListings()
  const { favoriteIds } = useFavorites()
  const favorites = listings.filter((listing) => favoriteIds.has(listing.id))

  return (
    <div className="container-page py-6 sm:py-10">
      <h1 className="font-display text-3xl font-bold italic tracking-tight text-ink sm:text-4xl">Preferiti</h1>
      <p className="mt-1 text-sm text-slate-600 sm:text-base">
        {status === 'success' && favorites.length > 0
          ? `${pluralize(favorites.length, 'annuncio salvato', 'annunci salvati')} su questo dispositivo.`
          : 'Gli annunci che salvi restano su questo dispositivo, anche senza account.'}
      </p>

      <div className="mt-6">
        {status === 'loading' && <ListingGridSkeleton count={4} />}
        {status === 'success' && favorites.length === 0 && (
          <div className="flex flex-col items-center rounded-3xl border-2 border-dashed border-slate-200 bg-white px-6 py-16 text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-rose-50 text-rose-500">
              <Heart className="size-7" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-ink">Nessun preferito, per ora</h2>
            <p className="mt-1 max-w-sm text-sm text-slate-600">Tocca il cuore su un annuncio per ritrovarlo qui.</p>
            <Link to={SEARCH_PATH} className={buttonStyles({ variant: 'primary', className: 'mt-6' })}>
              Cerca attrezzatura
            </Link>
          </div>
        )}
        {status === 'success' && favorites.length > 0 && <ListingGrid listings={favorites} />}
      </div>
    </div>
  )
}
