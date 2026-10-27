import { BadgeCheck, Star } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatDecimal, formatMonthYear, pluralize } from '@/lib/format'
import { getInitials } from '@/lib/text'
import type { Seller } from '@/types'

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

export function SellerCard({ seller }: { seller: Seller }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <div className="flex items-center gap-3">
        {seller.avatarUrl ? (
          <img src={seller.avatarUrl} alt="" className="size-12 rounded-full object-cover" />
        ) : (
          <span
            className="grid size-12 shrink-0 place-items-center rounded-full bg-linear-to-br from-brand-500 to-brand-800 text-base font-bold text-white"
            aria-hidden="true"
          >
            {getInitials(seller.displayName)}
          </span>
        )}
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 font-semibold text-ink">
            {seller.displayName}
            {seller.isVerified && (
              <>
                <BadgeCheck className="size-4.5 text-brand-600" aria-hidden="true" />
                <span className="sr-only">(venditore verificato)</span>
              </>
            )}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-600">
            <RatingStars rating={seller.rating} />
            <span>
              <span className="sr-only">Valutazione </span>
              {formatDecimal(seller.rating)}
              <span className="sr-only"> su 5</span> · {pluralize(seller.reviewCount, 'recensione', 'recensioni')}
            </span>
          </p>
        </div>
      </div>

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
    </div>
  )
}
