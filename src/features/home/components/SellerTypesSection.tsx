import { ArrowRight, Check, Store, UserRound } from 'lucide-react'
import { Link } from 'react-router'
import { buildSearchPath, shopPath } from '@/app/paths'
import { getInitials } from '@/lib/text'
import type { ShopSeller } from '@/types'

const SHOP_POINTS = [
  'Prodotti nuovi, fine serie e outlet',
  'Venditore professionale con partita IVA',
  'Garanzia legale e diritto di recesso dichiarati',
]

const PRIVATE_POINTS = ['Usato e mai usato', 'Condizioni e difetti dichiarati nell’annuncio', 'Ritiro di persona o spedizione']

export function SellerTypesSection({ shops }: { shops: readonly ShopSeller[] }) {
  return (
    <section aria-labelledby="sellers-title" className="container-page pt-14 sm:pt-20">
      <h2 id="sellers-title" className="font-display text-2xl font-bold italic tracking-tight text-ink sm:text-3xl">
        Negozi e privati, ognuno con la sua identità
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-slate-600 sm:text-base">
        Ogni annuncio dice sempre chi vende: condizioni di vendita, garanzie e diritti cambiano, e devono essere chiari
        prima di contattare.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="flex flex-col rounded-3xl bg-brand-950 p-6 text-white sm:p-8">
          <span className="grid size-12 place-items-center rounded-2xl bg-accent-500 text-brand-950">
            <Store className="size-6" aria-hidden="true" />
          </span>
          <h3 className="mt-5 font-display text-2xl font-bold italic">Negozi</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-brand-100">
            {SHOP_POINTS.map((point) => (
              <li key={point} className="flex gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-accent-400" strokeWidth={3} aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>

          {shops.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-300">Vetrine dei negozi</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {shops.map((shop) => (
                  <li key={shop.id}>
                    <Link
                      to={shopPath(shop.id)}
                      className="inline-flex items-center gap-2 rounded-full bg-white/10 py-1 pl-1 pr-3 text-sm font-medium text-white ring-1 ring-white/15 transition hover:bg-white/20"
                    >
                      <span className="grid size-7 place-items-center rounded-full bg-white text-[11px] font-bold text-brand-800" aria-hidden="true">
                        {getInitials(shop.displayName)}
                      </span>
                      {shop.displayName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Link
            to={buildSearchPath({ sellerKinds: ['negozio'] })}
            className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-accent-400 underline-offset-4 hover:underline"
          >
            Vedi tutte le offerte dei negozi
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </article>

        <article className="flex flex-col rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 sm:p-8">
          <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-700">
            <UserRound className="size-6" aria-hidden="true" />
          </span>
          <h3 className="mt-5 font-display text-2xl font-bold italic text-ink">Privati</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-700">
            {PRIVATE_POINTS.map((point) => (
              <li key={point} className="flex gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-brand-600" strokeWidth={3} aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
          <p className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
            Tra privati il pagamento si concorda direttamente: il diritto di recesso di 14 giorni vale solo per gli acquisti
            a distanza da un venditore professionale.
          </p>
          <Link
            to={buildSearchPath({ sellerKinds: ['privato'] })}
            className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
          >
            Vedi gli annunci dei privati
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </article>
      </div>
    </section>
  )
}
