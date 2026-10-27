import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { Clock, Heart, MapPin, Package, ShieldCheck, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/Badge'
import { SportIcon } from '@/components/ui/SportIcon'
import { getCategory, getSport } from '@/config/taxonomy'
import { discountPercent, formatPrice, formatRelativeDate } from '@/lib/format'
import type { Listing } from '@/types'
import { ContactSellerPanel } from './ContactSellerPanel'
import { ImageGallery } from './ImageGallery'
import { ConditionMeter, FastShippingBadge } from './ListingBadges'
import { SellerCard } from './SellerCard'

interface ListingDetailModalProps {
  /** Resta valorizzato durante l'animazione di chiusura. */
  listing: Listing | null
  open: boolean
  onClose: () => void
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
}

export function ListingDetailModal({ listing, open, onClose, isFavorite, onToggleFavorite }: ListingDetailModalProps) {
  return (
    <Dialog open={open && listing !== null} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-brand-950/65 backdrop-blur-sm transition-opacity duration-300 ease-out data-closed:opacity-0 data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 flex items-end justify-center sm:items-center sm:p-6">
        <DialogPanel
          transition
          className="relative flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl transition duration-300 ease-out data-closed:translate-y-full data-leave:duration-200 data-leave:ease-in sm:max-h-[90dvh] sm:rounded-3xl sm:data-closed:translate-y-6 sm:data-closed:scale-95 sm:data-closed:opacity-0 lg:h-[min(90dvh,780px)]"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-20 grid size-10 place-items-center rounded-full bg-white/95 text-ink shadow-lg backdrop-blur-sm transition hover:scale-105 hover:bg-white"
            aria-label="Chiudi dettaglio annuncio"
          >
            <X className="size-5" strokeWidth={2.5} aria-hidden="true" />
          </button>

          {listing && (
            <ListingDetailContent
              key={listing.id}
              listing={listing}
              isFavorite={isFavorite}
              onToggleFavorite={() => onToggleFavorite(listing.id)}
            />
          )}
        </DialogPanel>
      </div>
    </Dialog>
  )
}

interface ListingDetailContentProps {
  listing: Listing
  isFavorite: boolean
  onToggleFavorite: () => void
}

function ListingDetailContent({ listing, isFavorite, onToggleFavorite }: ListingDetailContentProps) {
  const sport = getSport(listing.sportId)
  const category = getCategory(listing.categoryId)
  const discount = discountPercent(listing.priceCents, listing.originalPriceCents)
  const specs = [{ label: 'Marca', value: listing.brand }, ...listing.specs]

  return (
    <div className="grid min-h-0 flex-1 overflow-y-auto overscroll-contain lg:grid-cols-[1.15fr_1fr] lg:overflow-hidden">
      <div className="lg:min-h-0">
        <ImageGallery images={listing.images} title={listing.title} />
      </div>

      <div className="min-h-0 lg:overflow-y-auto lg:overscroll-contain">
        <div className="space-y-7 p-5 sm:p-7">
          <header>
            <p className="flex items-center gap-1.5 pr-12 text-sm font-semibold text-brand-700">
              <SportIcon sportId={sport.id} className="size-4" />
              {sport.label} · {category.label}
            </p>
            <DialogTitle as="h2" className="mt-2 font-display text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
              {listing.title}
            </DialogTitle>

            <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-display text-4xl font-bold tracking-tight text-ink">{formatPrice(listing.priceCents)}</span>
              {listing.originalPriceCents && (
                <span className="text-sm text-slate-500">
                  da nuovo <span className="line-through">{formatPrice(listing.originalPriceCents)}</span>
                </span>
              )}
              {discount && <Badge tone="success">−{discount}%</Badge>}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {listing.hasFastShipping ? (
                <FastShippingBadge />
              ) : (
                <Badge tone="neutral">
                  <Package className="size-3.5" aria-hidden="true" />
                  Spedizione standard o ritiro
                </Badge>
              )}
              <Badge tone="neutral">
                <Heart className="size-3.5" aria-hidden="true" />
                {listing.favoritesCount} interessati
              </Badge>
            </div>

            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate-600">
              <li className="flex items-center gap-1.5">
                <MapPin className="size-4 text-slate-400" aria-hidden="true" />
                {listing.location.city} ({listing.location.province}) · {listing.location.postalCode}
              </li>
              <li className="flex items-center gap-1.5">
                <Clock className="size-4 text-slate-400" aria-hidden="true" />
                Pubblicato <time dateTime={listing.createdAt}>{formatRelativeDate(listing.createdAt)}</time>
              </li>
            </ul>
          </header>

          <ContactSellerPanel listing={listing} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} />

          <p className="flex gap-3 rounded-2xl bg-brand-50 p-4 text-sm text-brand-900">
            <ShieldCheck className="size-5 shrink-0 text-brand-600" aria-hidden="true" />
            <span>
              <strong className="font-semibold">Pagamento protetto Speedy Sport.</strong> Il venditore riceve il denaro
              solo dopo che hai confermato che l’articolo è come descritto.
            </span>
          </p>

          <DetailSection title="Descrizione">
            <p className="leading-relaxed text-slate-700">{listing.description}</p>
          </DetailSection>

          <DetailSection title="Stato di usura">
            <ConditionMeter conditionId={listing.condition} />
          </DetailSection>

          <DetailSection title="Specifiche tecniche">
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-slate-200 ring-1 ring-slate-200">
              {specs.map((spec) => (
                <div key={spec.label} className="bg-white p-3">
                  <dt className="text-xs text-slate-500">{spec.label}</dt>
                  <dd className="mt-0.5 text-sm font-medium text-ink">{spec.value}</dd>
                </div>
              ))}
              {specs.length % 2 === 1 && <div className="bg-white" aria-hidden="true" />}
            </dl>
          </DetailSection>

          <DetailSection title="Venditore">
            <SellerCard seller={listing.seller} />
          </DetailSection>
        </div>
      </div>
    </div>
  )
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">{title}</h3>
      {children}
    </section>
  )
}
