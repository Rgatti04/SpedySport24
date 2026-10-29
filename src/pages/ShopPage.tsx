import { BadgeCheck, Clock, CreditCard, MapPin, Phone, RotateCcw, ShieldCheck, Star, Store } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { OFFER_TYPES } from '@/config/taxonomy'
import { ListingGrid, ListingGridSkeleton } from '@/features/listings/components/ListingGrid'
import { useListings } from '@/features/listings/hooks/useListings'
import { ToggleChip } from '@/features/search/components/FilterControls'
import { formatDecimal, formatMonthYear, pluralize } from '@/lib/format'
import { usePageMeta } from '@/lib/hooks'
import type { OfferTypeId, ShopSeller } from '@/types'
import { NotFoundContent } from './NotFoundPage'

export function ShopPage() {
  const { sellerId } = useParams()
  const { listings, status } = useListings()
  const [offerType, setOfferType] = useState<OfferTypeId | null>(null)

  const shopListings = useMemo(
    () =>
      listings
        .filter((listing) => listing.seller.id === sellerId && listing.status !== 'venduto')
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [listings, sellerId],
  )
  const seller = shopListings[0]?.seller
  const shop: ShopSeller | null = seller?.kind === 'negozio' ? seller : null

  usePageMeta(shop?.displayName ?? (status === 'loading' ? 'Negozio' : 'Negozio non trovato'), shop?.shop.description)

  if (status === 'loading') {
    return (
      <div className="container-page py-8">
        <div className="h-40 animate-pulse rounded-3xl bg-slate-200/70" />
        <div className="mt-8">
          <ListingGridSkeleton count={4} />
        </div>
      </div>
    )
  }

  if (!shop) {
    return <NotFoundContent title="Negozio non trovato" text="La vetrina potrebbe non essere più attiva, oppure il link non è corretto." />
  }

  const typeCounts = new Map<OfferTypeId, number>()
  for (const listing of shopListings) typeCounts.set(listing.offerType, (typeCounts.get(listing.offerType) ?? 0) + 1)
  const visibleListings = offerType ? shopListings.filter((listing) => listing.offerType === offerType) : shopListings
  const { policies } = shop.shop

  return (
    <div className="container-page py-6 sm:py-8">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Negozi' }, { label: shop.displayName }]} />

      <section aria-labelledby="shop-title" className="mt-4 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200/80">
        <div className="bg-brand-950 px-5 py-6 text-white sm:px-8 sm:py-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-white text-brand-800 shadow-lg" aria-hidden="true">
              <Store className="size-8" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent-400">Negozio · vetrina professionale</p>
              <h1 id="shop-title" className="mt-1 font-display text-3xl font-bold italic tracking-tight">
                {shop.displayName}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-brand-100">
                <span className="flex items-center gap-1.5">
                  <Star className="size-4 fill-accent-500 text-accent-500" aria-hidden="true" />
                  {formatDecimal(shop.rating)} · {pluralize(shop.reviewCount, 'recensione', 'recensioni')}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4" aria-hidden="true" />
                  {shop.location.city} ({shop.location.province})
                </span>
                {shop.verifiedAt && (
                  <span className="flex items-center gap-1.5">
                    <BadgeCheck className="size-4 text-accent-400" aria-hidden="true" />
                    Partita IVA verificata
                  </span>
                )}
              </div>
            </div>
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-brand-100 sm:text-base">{shop.shop.description}</p>
        </div>

        <div className="grid gap-6 p-5 sm:p-8 md:grid-cols-2">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Contatti e orari</h2>
            <ul className="mt-3 space-y-2.5 text-sm text-slate-700">
              <li className="flex gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden="true" />
                {shop.shop.address}
              </li>
              <li className="flex gap-2">
                <Phone className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden="true" />
                {shop.shop.phone}
              </li>
              <li className="flex gap-2">
                <Clock className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden="true" />
                {shop.shop.openingHours}
              </li>
            </ul>
            <p className="mt-3 text-xs text-slate-500">
              {shop.shop.legalName} · P.IVA {shop.shop.vatNumber} · su SpeedySport24 da {formatMonthYear(shop.memberSince)}
            </p>
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Condizioni di vendita</h2>
            <ul className="mt-3 space-y-2.5 text-sm text-slate-700">
              <li className="flex gap-2">
                <RotateCcw className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden="true" />
                Recesso entro {policies.returnDays} giorni per gli acquisti a distanza
              </li>
              <li className="flex gap-2">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden="true" />
                {policies.warrantyNote}
              </li>
              <li className="flex gap-2">
                <CreditCard className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden="true" />
                {policies.paymentMethods.join(' · ')}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="shop-listings-title" className="mt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="shop-listings-title" className="font-display text-2xl font-bold italic tracking-tight text-ink">
            In vetrina · {pluralize(shopListings.length, 'prodotto', 'prodotti')}
          </h2>
          <div role="group" aria-label="Filtra per tipologia" className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 scrollbar-none sm:mx-0 sm:px-0">
            <ToggleChip pressed={offerType === null} onClick={() => setOfferType(null)} count={shopListings.length}>
              Tutti
            </ToggleChip>
            {OFFER_TYPES.filter((type) => typeCounts.has(type.id)).map((type) => (
              <ToggleChip
                key={type.id}
                pressed={offerType === type.id}
                onClick={() => setOfferType(type.id)}
                count={typeCounts.get(type.id)}
              >
                {type.label}
              </ToggleChip>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <ListingGrid listings={visibleListings} />
        </div>
      </section>
    </div>
  )
}
