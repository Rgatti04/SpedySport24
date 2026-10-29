import { AlertTriangle, Camera, Clock, Heart, MapPin, RotateCcw } from 'lucide-react'
import { useMemo } from 'react'
import { useParams } from 'react-router'
import { buildSearchPath } from '@/app/paths'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Button } from '@/components/ui/Button'
import { getSport, getSubcategory } from '@/config/taxonomy'
import { ContactSellerPanel } from '@/features/listings/components/ContactSellerPanel'
import { ImageGallery } from '@/features/listings/components/ImageGallery'
import { ProductStateBadge, SellerKindBadge, StatusBadge } from '@/features/listings/components/ListingBadges'
import {
  ConditionDetails,
  DetailSection,
  PriceInsightCard,
  PurchaseInfo,
  ReportListing,
  SpecSheet,
} from '@/features/listings/components/ListingDetails'
import { ListingRail } from '@/features/listings/components/ListingRail'
import { SellerCard } from '@/features/listings/components/SellerCard'
import { useFavorites } from '@/features/listings/hooks/useFavorites'
import { useListings } from '@/features/listings/hooks/useListings'
import { getPriceInsight } from '@/features/listings/lib/priceInsight'
import { formatPrice, formatRelativeDate, pluralize } from '@/lib/format'
import { usePageMeta } from '@/lib/hooks'
import type { Listing } from '@/types'
import { NotFoundContent } from './NotFoundPage'

const SIMILAR_COUNT = 4

export function ListingPage() {
  const { listingId } = useParams()
  const { listings, status, retry } = useListings()
  const listing = listings.find((item) => item.id === listingId) ?? null

  usePageMeta(
    listing?.title ?? (status === 'loading' ? 'Annuncio' : 'Annuncio non trovato'),
    listing ? `${listing.title} a ${formatPrice(listing.priceCents)} · ${listing.location.city}. ${listing.description}` : undefined,
  )

  if (status === 'loading') return <ListingPageSkeleton />

  if (status === 'error') {
    return (
      <div className="container-page flex flex-col items-center py-20 text-center">
        <AlertTriangle className="size-8 text-brand-600" aria-hidden="true" />
        <h1 className="mt-3 text-lg font-semibold text-ink">Non siamo riusciti a caricare l’annuncio</h1>
        <Button className="mt-5" onClick={retry}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Riprova
        </Button>
      </div>
    )
  }

  if (!listing) {
    return (
      <NotFoundContent
        title="Annuncio non trovato"
        text="Potrebbe essere stato rimosso dal venditore, oppure il link non è corretto."
      />
    )
  }

  // La chiave azzera galleria, contatto e segnalazione quando si passa a un annuncio simile.
  return <ListingContent key={listing.id} listing={listing} catalog={listings} />
}

function ListingContent({ listing, catalog }: { listing: Listing; catalog: readonly Listing[] }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const sport = getSport(listing.sportId)
  const subcategory = getSubcategory(listing.subcategoryId)
  const isShop = listing.seller.kind === 'negozio'

  const insight = useMemo(() => getPriceInsight(listing, catalog), [listing, catalog])
  const similar = useMemo(
    () =>
      catalog
        .filter((other) => other.id !== listing.id && other.status !== 'venduto' && other.subcategoryId === listing.subcategoryId)
        .slice(0, SIMILAR_COUNT),
    [listing, catalog],
  )

  return (
    <>
      <div className="container-page py-6 sm:py-8">
        <Breadcrumbs
          items={[
            { label: 'Home', to: '/' },
            { label: sport.label, to: buildSearchPath({ sport: sport.id }) },
            { label: subcategory.label, to: buildSearchPath({ subcategory: subcategory.id }) },
            { label: listing.title },
          ]}
        />

        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-x-10">
          <div className="lg:col-start-1 lg:row-start-1">
            <ImageGallery images={listing.images} title={listing.title} />
            <p className="mt-2 flex items-start gap-1.5 text-xs text-slate-500">
              <Camera className="mt-px size-3.5 shrink-0" aria-hidden="true" />
              Prototipo: foto dimostrative. Negli annunci reali saranno obbligatorie foto dell’oggetto in vendita, difetti
              compresi.
            </p>
          </div>

          <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <div className="space-y-5 lg:sticky lg:top-24">
              <header>
                <div className="flex flex-wrap items-center gap-2">
                  {listing.status !== 'disponibile' && <StatusBadge status={listing.status} />}
                  <ProductStateBadge offerType={listing.offerType} condition={listing.condition} />
                  <SellerKindBadge kind={listing.seller.kind} />
                </div>
                <h1 className="mt-3 font-display text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
                  {listing.title}
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  {listing.brand}
                  {listing.model && ` · ${listing.model}`}
                </p>
                <p className="mt-4 font-display text-4xl font-bold tracking-tight text-ink">
                  <span className="sr-only">Prezzo richiesto: </span>
                  {formatPrice(listing.priceCents)}
                </p>
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate-600">
                  <li className="flex items-center gap-1.5">
                    <MapPin className="size-4 text-slate-400" aria-hidden="true" />
                    {listing.location.city} ({listing.location.province}) · {listing.location.postalCode}
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Clock className="size-4 text-slate-400" aria-hidden="true" />
                    Pubblicato <time dateTime={listing.createdAt}>{formatRelativeDate(listing.createdAt)}</time>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Heart className="size-4 text-slate-400" aria-hidden="true" />
                    {pluralize(listing.favoritesCount, 'persona interessata', 'persone interessate')}
                  </li>
                </ul>
              </header>

              <ContactSellerPanel
                listing={listing}
                isFavorite={isFavorite(listing.id)}
                onToggleFavorite={() => toggleFavorite(listing.id)}
              />

              <PriceInsightCard listing={listing} insight={insight} />
            </div>
          </div>

          <div className="space-y-6 lg:col-start-1 lg:row-start-2">
            <DetailSection id="descrizione" title="Descrizione">
              <p className="leading-relaxed text-slate-700">{listing.description}</p>
            </DetailSection>
            <DetailSection id="condizioni" title="Condizioni e difetti">
              <ConditionDetails listing={listing} />
            </DetailSection>
            <DetailSection id="scheda-tecnica" title={`Scheda tecnica · ${subcategory.label}`}>
              <SpecSheet listing={listing} />
            </DetailSection>
            <DetailSection id="acquisto" title="Consegna, pagamento e garanzie">
              <PurchaseInfo listing={listing} />
            </DetailSection>
            <DetailSection id="venditore" title={isShop ? 'Il negozio' : 'Il venditore'}>
              <SellerCard seller={listing.seller} />
            </DetailSection>
            <ReportListing />
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <ListingRail
          id="annunci-simili"
          title="Annunci simili"
          description={`Altri annunci in ${subcategory.label}.`}
          listings={similar}
          isLoading={false}
          seeAllTo={buildSearchPath({ subcategory: subcategory.id })}
        />
      )}
    </>
  )
}

function ListingPageSkeleton() {
  return (
    <div className="container-page py-8" aria-busy="true" aria-label="Caricamento annuncio">
      <div className="h-4 w-64 animate-pulse rounded bg-slate-200/70" />
      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-10">
        <div className="aspect-[4/3] animate-pulse rounded-3xl bg-slate-200/70" />
        <div className="space-y-4">
          <div className="h-6 w-1/2 animate-pulse rounded-full bg-slate-200/70" />
          <div className="h-9 w-full animate-pulse rounded bg-slate-200/70" />
          <div className="h-10 w-1/3 animate-pulse rounded bg-slate-200/70" />
          <div className="h-12 w-full animate-pulse rounded-xl bg-slate-200/70" />
        </div>
      </div>
    </div>
  )
}
