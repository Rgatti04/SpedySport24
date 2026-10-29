import { ArrowRight, BadgeCheck, Clock, MapPin, Phone, Star, Store } from 'lucide-react'
import { Link } from 'react-router'
import { shopPath } from '@/app/paths'
import { cn } from '@/lib/cn'
import { formatDecimal, formatMonthYear, pluralize } from '@/lib/format'
import { getInitials } from '@/lib/text'
import type { Seller } from '@/types'
import { SellerKindBadge } from './ListingBadges'

function RatingStars({ rating }: { rating: number }) {
  const filled = Math.round(rating)
  return (
    <span className="flex items-center gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn('size-3.5', star <= filled ? 'fill-accent-500 text-accent-500' : 'fill-slate-200 text-slate-200')}
        />
      ))}
    </span>
  )
}

function Rating({ seller }: { seller: Seller }) {
  return (
    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-600">
      <RatingStars rating={seller.rating} />
      <span>
        <span className="sr-only">Valutazione </span>
        {formatDecimal(seller.rating)}
        <span className="sr-only"> su 5</span> · {pluralize(seller.reviewCount, 'recensione', 'recensioni')}
      </span>
    </p>
  )
}

/** Il badge compare solo se la verifica è avvenuta davvero (`verifiedAt` valorizzato). */
function VerifiedMark({ seller }: { seller: Seller }) {
  if (!seller.verifiedAt) return null
  const label = seller.kind === 'negozio' ? 'Partita IVA verificata' : 'Identità verificata'
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-700" title={`${label} il ${formatMonthYear(seller.verifiedAt)}`}>
      <BadgeCheck className="size-4 text-brand-600" aria-hidden="true" />
      {label}
    </span>
  )
}

export function SellerCard({ seller }: { seller: Seller }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'grid size-12 shrink-0 place-items-center text-base font-bold text-white',
            seller.kind === 'negozio'
              ? 'rounded-xl bg-linear-to-br from-indigo-500 to-brand-800'
              : 'rounded-full bg-linear-to-br from-brand-500 to-brand-800',
          )}
          aria-hidden="true"
        >
          {seller.kind === 'negozio' ? <Store className="size-5.5" /> : getInitials(seller.displayName)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="font-semibold text-ink">{seller.displayName}</p>
            <SellerKindBadge kind={seller.kind} />
          </div>
          <Rating seller={seller} />
          <div className="mt-1.5">
            <VerifiedMark seller={seller} />
          </div>
        </div>
      </div>

      {seller.kind === 'negozio' ? (
        <>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden="true" />
              {seller.shop.address}
            </li>
            <li className="flex gap-2">
              <Clock className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden="true" />
              {seller.shop.openingHours}
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden="true" />
              {seller.shop.phone}
            </li>
          </ul>
          <p className="mt-3 text-xs text-slate-500">
            {seller.shop.legalName} · P.IVA {seller.shop.vatNumber}
          </p>
          <Link
            to={shopPath(seller.id)}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
          >
            Vai alla vetrina del negozio
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </>
      ) : (
        <dl className="mt-4 grid grid-cols-3 divide-x divide-slate-200 rounded-xl bg-slate-50 py-3 text-center">
          <div className="px-2">
            <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Venduti</dt>
            <dd className="mt-0.5 text-sm font-semibold text-ink">{seller.soldCount}</dd>
          </div>
          <div className="px-2">
            <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Risponde</dt>
            <dd className="mt-0.5 text-sm font-semibold text-ink">~{seller.responseTimeHours} h</dd>
          </div>
          <div className="px-2">
            <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-500">Iscritto</dt>
            <dd className="mt-0.5 text-sm font-semibold capitalize text-ink">{formatMonthYear(seller.memberSince)}</dd>
          </div>
        </dl>
      )}
    </div>
  )
}
