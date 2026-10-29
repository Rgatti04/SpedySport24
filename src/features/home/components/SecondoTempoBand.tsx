import { ArrowRight, Recycle } from 'lucide-react'
import { Link } from 'react-router'
import { buildSearchPath } from '@/app/paths'

/** "Secondo Tempo": lo spazio dedicato alla seconda vita dell'attrezzatura (usato e mai usato). */
export function SecondoTempoBand() {
  return (
    <section aria-labelledby="secondo-tempo-title" className="container-page pt-14 sm:pt-20">
      <div className="flex flex-col gap-6 rounded-3xl bg-brand-50 p-6 ring-1 ring-brand-100 sm:p-8 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-700 text-white">
            <Recycle className="size-6" aria-hidden="true" />
          </span>
          <div>
            <h2 id="secondo-tempo-title" className="font-display text-2xl font-bold italic tracking-tight text-ink">
              Secondo Tempo
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-700 sm:text-base">
              L’attrezzatura sportiva merita una seconda partita. Qui trovi solo usato e mai usato: fare sport spendendo
              meno e sprecando meno.
            </p>
          </div>
        </div>
        <Link
          to={buildSearchPath({ offerGroups: ['mai-usato', 'usato'] })}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-800"
        >
          Esplora Secondo Tempo
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
