import { Images, MapPin } from 'lucide-react'
import { SportIcon } from '@/components/ui/SportIcon'
import { getCategory, getSport } from '@/config/taxonomy'
import { formatPrice, formatRelativeDate } from '@/lib/format'
import { buildImageUrl, buildSrcSet } from '@/lib/images'
import type { Listing } from '@/types'
import { FavoriteButton } from './FavoriteButton'
import { ConditionBadge, FastShippingBadge } from './ListingBadges'

const IMAGE_ASPECT = 4 / 5

interface ListingCardProps {
  listing: Listing
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  onOpen: (listing: Listing) => void
}

export function ListingCard({ listing, isFavorite, onToggleFavorite, onOpen }: ListingCardProps) {
  const cover = listing.images[0]
  const sport = getSport(listing.sportId)
  const category = getCategory(listing.categoryId)

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-900/10 hover:ring-brand-200">
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
        {cover && (
          <img
            src={buildImageUrl(cover.url, { width: 480, height: 600 })}
            srcSet={buildSrcSet(cover.url, [320, 480, 640, 800], IMAGE_ASPECT)}
            sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw"
            alt={cover.alt}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition duration-700 ease-out group-hover:scale-105"
          />
        )}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/35 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
        />
        {listing.hasFastShipping && <FastShippingBadge compact className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3" />}
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
          <SportIcon sportId={sport.id} className="size-3.5 shrink-0" />
          <span className="truncate">
            {sport.label} · {category.label}
          </span>
        </p>

        <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug text-ink sm:text-[15px]">
          {/* Link "esteso" (stretched): tutta la card è cliccabile senza annidare elementi interattivi. */}
          <button
            type="button"
            onClick={() => onOpen(listing)}
            className="text-left after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:outline-none focus-visible:after:ring-3 focus-visible:after:ring-inset focus-visible:after:ring-brand-600"
          >
            {listing.title}
          </button>
        </h3>

        <ConditionBadge conditionId={listing.condition} className="mt-2.5 w-fit" />

        <div className="mt-auto pt-3">
          <p className="flex items-baseline gap-2">
            <span className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
              {formatPrice(listing.priceCents)}
            </span>
            {listing.originalPriceCents && (
              <span className="text-xs text-slate-400 line-through">
                <span className="sr-only">Prezzo da nuovo </span>
                {formatPrice(listing.originalPriceCents)}
              </span>
            )}
          </p>
          <p className="mt-1.5 flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="size-3.5 shrink-0 text-slate-400" aria-hidden="true" />
            <span className="truncate">
              {listing.location.city} ({listing.location.province})
            </span>
            <span aria-hidden="true" className="hidden sm:inline">
              ·
            </span>
            <time dateTime={listing.createdAt} className="hidden shrink-0 sm:inline">
              {formatRelativeDate(listing.createdAt)}
            </time>
          </p>
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
