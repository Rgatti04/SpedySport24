import { CheckCircle2, CreditCard, Flag, Handshake, Info, PackageCheck, RotateCcw, ShieldAlert, Truck } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router'
import { buildSearchPath } from '@/app/paths'
import { Button } from '@/components/ui/Button'
import { formatAttributeValue, getAttribute } from '@/config/attributes'
import { getOfferType, getSubcategory } from '@/config/taxonomy'
import { cn } from '@/lib/cn'
import { formatPrice, formatShippingCost, pluralize } from '@/lib/format'
import type { Listing } from '@/types'
import { getOfferGroupOf } from '../lib/filterListings'
import { MIN_COMPARABLES, type PriceInsight } from '../lib/priceInsight'
import { ConditionMeter, OfferTypeBadge } from './ListingBadges'

export function DetailSection({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  return (
    <section aria-labelledby={id} className="border-t border-slate-200 pt-6">
      <h2 id={id} className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
        {title}
      </h2>
      {children}
    </section>
  )
}

/** Scheda tecnica omogenea: tutti gli attributi della sottocategoria, anche se non indicati. */
export function SpecSheet({ listing }: { listing: Listing }) {
  const subcategory = getSubcategory(listing.subcategoryId)
  const rows = [
    { label: 'Marca', value: listing.brand },
    { label: 'Modello', value: listing.model ?? 'Non indicato' },
    ...subcategory.attributes.map((key) => {
      const definition = getAttribute(key)
      const value = listing.attributes[key]
      return {
        label: definition.label,
        value: value === undefined ? (definition.kind === 'boolean' ? 'No' : 'Non indicato') : formatAttributeValue(definition, value),
      }
    }),
    ...listing.extraSpecs,
  ]

  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-slate-200 ring-1 ring-slate-200">
      {rows.map((row) => (
        <div key={row.label} className="bg-white p-3">
          <dt className="text-xs text-slate-500">{row.label}</dt>
          <dd className={cn('mt-0.5 text-sm font-medium', row.value === 'Non indicato' ? 'text-slate-400' : 'text-ink')}>
            {row.value}
          </dd>
        </div>
      ))}
      {rows.length % 2 === 1 && <div className="bg-white" aria-hidden="true" />}
    </dl>
  )
}

export function ConditionDetails({ listing }: { listing: Listing }) {
  return (
    <div className="space-y-4">
      {listing.condition ? (
        <ConditionMeter conditionId={listing.condition} />
      ) : (
        listing.offerType !== 'usato' && (
          <div className="flex items-start gap-3">
            <OfferTypeBadge offerType={listing.offerType} />
            <p className="text-sm text-slate-600">{getOfferType(listing.offerType).description}</p>
          </div>
        )
      )}

      <div className="rounded-2xl bg-slate-50 p-4">
        <p className="text-sm font-semibold text-ink">Difetti dichiarati</p>
        {listing.defects.length > 0 ? (
          <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
            {listing.defects.map((defect) => (
              <li key={defect} className="flex gap-2">
                <Info className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden="true" />
                {defect}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-sm text-slate-600">Nessun difetto dichiarato dal venditore.</p>
        )}
      </div>
    </div>
  )
}

/** Prezzo come informazione: fascia degli annunci comparabili, o la dichiarazione che il campione non basta. */
export function PriceInsightCard({ listing, insight }: { listing: Listing; insight: PriceInsight }) {
  const { band, comparables, criteria, position } = insight
  const similarPath = buildSearchPath({
    subcategory: listing.subcategoryId,
    offerGroups: [getOfferGroupOf(listing)],
  })

  return (
    <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200/70">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Prezzo e confronto</p>
      {band ? (
        <>
          <p className="mt-2 text-sm text-slate-700">
            Annunci comparabili ({criteria}):{' '}
            <strong className="font-semibold text-ink">
              {formatPrice(band.minCents)} – {formatPrice(band.maxCents)}
            </strong>
            , mediana {formatPrice(band.medianCents)}.
          </p>
          <PriceBandBar priceCents={listing.priceCents} band={band} />
          <p className="mt-2 text-sm text-slate-700">
            Il prezzo richiesto è{' '}
            <strong className="font-semibold text-ink">
              {position === 'below' ? 'sotto la fascia' : position === 'above' ? 'sopra la fascia' : 'nella fascia'}
            </strong>
            .
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Basato su {pluralize(comparables.length, 'annuncio attivo', 'annunci attivi')}: sono prezzi richiesti, non prezzi
            di vendita effettivi.
          </p>
        </>
      ) : (
        <p className="mt-2 text-sm text-slate-700">
          Non ci sono ancora abbastanza annunci comparabili ({criteria}) per indicare una fascia attendibile: ne servono
          almeno {MIN_COMPARABLES}, oggi {comparables.length === 1 ? 'ce n’è 1' : `ce ne sono ${comparables.length}`}.
        </p>
      )}
      <Link to={similarPath} className="mt-3 inline-block text-sm font-semibold text-brand-700 underline-offset-4 hover:underline">
        Confronta con annunci simili
      </Link>
    </div>
  )
}

function PriceBandBar({ priceCents, band }: { priceCents: number; band: NonNullable<PriceInsight['band']> }) {
  const spread = Math.max(band.maxCents - band.minCents, 1)
  const padding = spread * 0.25
  const start = band.minCents - padding
  const total = spread + padding * 2
  const toPercent = (value: number) => Math.min(100, Math.max(0, ((value - start) / total) * 100))

  return (
    <div className="relative mt-4 h-2 rounded-full bg-slate-200" aria-hidden="true">
      <div
        className="absolute inset-y-0 rounded-full bg-brand-200"
        style={{ left: `${toPercent(band.minCents)}%`, right: `${100 - toPercent(band.maxCents)}%` }}
      />
      <div
        className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-brand-700 shadow"
        style={{ left: `${toPercent(priceCents)}%` }}
      />
    </div>
  )
}

function InfoRow({ icon: Icon, title, children }: { icon: typeof Truck; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
        <Icon className="size-4.5" aria-hidden="true" />
      </span>
      <div className="min-w-0 text-sm">
        <p className="font-semibold text-ink">{title}</p>
        <div className="mt-0.5 text-slate-600">{children}</div>
      </div>
    </li>
  )
}

/** Consegna, pagamento e diritti: dipendono da chi vende, quindi lo diciamo in chiaro. */
export function PurchaseInfo({ listing }: { listing: Listing }) {
  const { delivery, seller } = listing

  return (
    <ul className="space-y-4">
      <InfoRow icon={Truck} title="Spedizione">
        {delivery.shipping ? (
          <>Disponibile · {formatShippingCost(delivery.shippingCostCents)}</>
        ) : (
          <>Non disponibile per questo articolo.</>
        )}
      </InfoRow>
      <InfoRow icon={Handshake} title="Ritiro di persona">
        {delivery.pickup ? (
          <>
            {seller.kind === 'negozio' ? 'In negozio' : 'Presso il venditore'} a {listing.location.city} ({listing.location.province}).
          </>
        ) : (
          <>Non previsto.</>
        )}
      </InfoRow>

      {seller.kind === 'negozio' ? (
        <>
          <InfoRow icon={CreditCard} title="Pagamento">
            Metodi dichiarati dal negozio: {seller.shop.policies.paymentMethods.join(', ')}.
          </InfoRow>
          <InfoRow icon={RotateCcw} title="Recesso e garanzia">
            Recesso entro {seller.shop.policies.returnDays} giorni per gli acquisti a distanza.{' '}
            {seller.shop.policies.warrantyNote}
          </InfoRow>
          {listing.quantity > 1 && (
            <InfoRow icon={PackageCheck} title="Disponibilità">
              {pluralize(listing.quantity, 'pezzo disponibile', 'pezzi disponibili')}.
            </InfoRow>
          )}
        </>
      ) : (
        <InfoRow icon={CreditCard} title="Pagamento">
          Da concordare con il venditore. Tra privati non si applica il diritto di recesso previsto per gli acquisti da
          negozio: per gli scambi a mano verifica l’articolo prima di pagare e non condividere i dati della carta in chat.
        </InfoRow>
      )}
    </ul>
  )
}

const REPORT_REASONS = [
  'Possibile truffa o annuncio falso',
  'Le foto non mostrano l’oggetto in vendita',
  'Prodotto pericoloso o non sicuro',
  'Descrizione o prezzo ingannevoli',
  'Altro',
] as const

/** Strumento minimo di moderazione: la segnalazione arriverà alla coda del pannello amministrativo. */
export function ReportListing() {
  const [isOpen, setIsOpen] = useState(false)
  const [reason, setReason] = useState<string | null>(null)
  const [isSent, setIsSent] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (reason) setIsSent(true)
  }

  if (isSent) {
    return (
      <p role="status" className="flex gap-2 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900 ring-1 ring-emerald-200">
        <CheckCircle2 className="size-5 shrink-0 text-emerald-600" aria-hidden="true" />
        Grazie: in produzione la segnalazione arriverà al team di moderazione (demo, nessun invio reale).
      </p>
    )
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-slate-500 underline-offset-4 hover:text-rose-700 hover:underline"
      >
        <Flag className="size-4" aria-hidden="true" />
        Segnala annuncio
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 p-4">
      <fieldset>
        <legend className="flex items-center gap-2 text-sm font-semibold text-ink">
          <ShieldAlert className="size-4.5 text-rose-600" aria-hidden="true" />
          Perché segnali questo annuncio?
        </legend>
        <div className="mt-3 space-y-1">
          {REPORT_REASONS.map((item) => (
            <label key={item} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
              <input
                type="radio"
                name="report-reason"
                value={item}
                checked={reason === item}
                onChange={() => setReason(item)}
                className="size-4 accent-brand-600"
              />
              {item}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-3 flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          Annulla
        </Button>
        <Button type="submit" size="sm" disabled={!reason}>
          Invia segnalazione
        </Button>
      </div>
    </form>
  )
}
