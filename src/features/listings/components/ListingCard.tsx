import { Handshake, Images, MapPin, Store, UserRound } from 'lucide-react'
import { Link } from 'react-router'
import { listingPath } from '@/app/paths'
import { getSubcategory } from '@/config/taxonomy'
import { SportIcon } from '@/components/ui/SportIcon'
import { formatDistance, formatPrice } from '@/lib/format'
import { buildImageUrl, buildSrcSet } from '@/lib/images'
import type { Listing } from '@/types'
import { FavoriteButton } from './FavoriteButton'
import { ConditionBadge, OfferTypeBadge, StatusBadge } from './ListingBadges'

const IMAGE_ASPECT = 4 / 5

interface ListingCardProps {
  listing: Listing
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  /** Distanza dal luogo cercato, se noto. */
  distanceKm?: number | null
  /** Le card nei caroselli della home sono più strette: immagini più piccole. */
  sizes?: string
}

export function ListingCard({
  listing,
  isFavorite,
  onToggleFavorite,
  distanceKm = null,
  sizes = '(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw',
}: ListingCardProps) {
  const cover = listing.images[0]
  const subcategory = getSubcategory(listing.subcategoryId)
  const isShop = listing.seller.kind === 'negozio'

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-900/10 hover:ring-brand-200">
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
        {cover && (
          <img
            src={buildImageUrl(cover.url, { width: 480, height: 600 })}
            srcSet={buildSrcSet(cover.url, [320, 480, 640, 800], IMAGE_ASPECT)}
            sizes={sizes}
            alt={cover.alt}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition duration-700 ease-out group-hover:scale-105"
          />
        )}
        <div className="absolute left-2.5 top-2.5 flex max-w-[calc(100%-3.75rem)] flex-col items-start gap-1.5 sm:left-3 sm:top-3">
          {listing.status !== 'disponibile' && <StatusBadge status={listing.status} />}
          {listing.offerType !== 'usato' && <OfferTypeBadge offerType={listing.offerType} className="shadow-sm" />}
        </div>
        {listing.images.length > 1 && (
          <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm sm:bottom-3 sm:left-3">
            <Images className="size-3.5" aria-hidden="true" />
            {listing.images.length}
            <span className="sr-only">foto</span>
          </span>
        )}
        <FavoriteButton
          isFavorite={isFavorite}
          onToggle={() => onToggleFavorite(listing.id)}
          className="absolute right-2.5 top-2.5 z-10 sm:right-3 sm:top-3"
        />
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="flex min-w-0 items-center gap-1.5 text-[11px] font-semibold text-brand-700 sm:text-xs">
          <SportIcon sportId={listing.sportId} className="size-3.5 shrink-0" />
          <span className="truncate">{subcategory.label}</span>
        </p>

        <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug text-ink sm:text-[15px]">
          {/* Link "esteso" (stretched): tutta la card è cliccabile senza annidare elementi interattivi. */}
          <Link
            to={listingPath(listing.id)}
            className="after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:outline-none focus-visible:after:ring-3 focus-visible:after:ring-inset focus-visible:after:ring-brand-600"
          >
            {listing.title}
          </Link>
        </h3>

        {listing.condition && <ConditionBadge conditionId={listing.condition} className="mt-2.5 w-fit" />}

        <div className="mt-auto pt-3">
          <p className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">{formatPrice(listing.priceCents)}</p>

          <p className="mt-1.5 flex min-w-0 items-center gap-1 text-[11px] font-medium sm:text-xs">
            {isShop ? (
              <>
                <Store className="size-3.5 shrink-0 text-indigo-600" aria-hidden="true" />
                <span className="truncate text-indigo-700">
                  <span className="sr-only">Venditore: negozio </span>
                  {listing.seller.displayName}
                </span>
              </>
            ) : (
              <>
                <UserRound className="size-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                <span className="text-slate-600">
                  <span className="sr-only">Venditore: </span>Privato
                </span>
              </>
            )}
          </p>

          <p className="mt-1 flex min-w-0 items-center gap-1 text-xs text-slate-500">
            <MapPin className="size-3.5 shrink-0 text-slate-400" aria-hidden="true" />
            <span className="truncate">
              {listing.location.city} ({listing.location.province})
              {distanceKm !== null && <> · {formatDistance(distanceKm)}</>}
            </span>
          </p>

          {!listing.delivery.shipping && (
            <p className="mt-1 flex items-center gap-1 text-xs font-medium text-amber-700">
              <Handshake className="size-3.5 shrink-0" aria-hidden="true" />
              Solo ritiro di persona
            </p>
          )}
        </div>
      </div>
    </article>
  )
}

export function ListingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80" aria-hidden="true">
      <div className="aspect-[4/5] animate-pulse bg-slate-200/70" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-2/3 animate-pulse rounded bg-slate-200/70" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-200/70" />
        <div className="h-5 w-1/3 animate-pulse rounded-full bg-slate-200/70" />
        <div className="h-6 w-1/2 animate-pulse rounded bg-slate-200/70" />
      </div>
    </div>
  )
}
