import { Link } from 'react-router'
import { buildSearchPath } from '@/app/paths'
import { SportIcon } from '@/components/ui/SportIcon'
import { SPORTS } from '@/config/taxonomy'
import { pluralize } from '@/lib/format'
import { buildImageUrl, buildSrcSet } from '@/lib/images'
import type { Sport, SportId } from '@/types'

const CARD_ASPECT = 4 / 5

function SportCard({ sport, count }: { sport: Sport; count: number | undefined }) {
  return (
    <Link
      to={buildSearchPath({ sport: sport.id })}
      className="group relative isolate flex aspect-[4/5] w-full flex-col overflow-hidden rounded-2xl p-4 text-left text-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-900/25 focus-visible:outline-offset-4"
    >
      <img
        src={buildImageUrl(sport.imageUrl, { width: 400, height: 500 })}
        srcSet={buildSrcSet(sport.imageUrl, [240, 400, 560], CARD_ASPECT)}
        sizes="(min-width: 1024px) 200px, (min-width: 640px) 30vw, 44vw"
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 -z-20 size-full object-cover transition duration-700 ease-out group-hover:scale-110"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-brand-950/95 via-brand-950/45 to-brand-950/5 transition group-hover:from-brand-900/95"
      />

      <span className="grid size-10 place-items-center rounded-xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-sm transition duration-300 group-hover:bg-accent-500 group-hover:text-brand-950">
        <SportIcon sportId={sport.id} className="size-5" />
      </span>

      <span className="mt-auto font-display text-lg font-bold italic leading-tight tracking-tight">{sport.label}</span>
      <span className="mt-0.5 line-clamp-1 text-xs text-white/75">{sport.tagline}</span>
      <span className="mt-2 inline-flex w-fit rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-semibold backdrop-blur-sm">
        {count === undefined ? 'Caricamento…' : pluralize(count, 'annuncio', 'annunci')}
      </span>
    </Link>
  )
}

interface SportCategoriesSectionProps {
  countsBySport: Partial<Record<SportId, number>> | null
}

export function SportCategoriesSection({ countsBySport }: SportCategoriesSectionProps) {
  return (
    <section aria-labelledby="sports-title" className="container-page pt-12 sm:pt-16">
      <h2 id="sports-title" className="font-display text-2xl font-bold italic tracking-tight text-ink sm:text-3xl">
        Esplora per sport
      </h2>
      <p className="mt-1 text-sm text-slate-600 sm:text-base">Ogni disciplina ha i suoi filtri tecnici: taglie, misure, materiali.</p>

      {/* Carosello a scorrimento su mobile/tablet, griglia a 6 colonne su desktop */}
      <ul className="-mx-4 mt-6 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-3 pt-1 scrollbar-none sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-6 lg:gap-4 lg:overflow-visible lg:px-0">
        {SPORTS.map((sport) => (
          <li key={sport.id} className="w-[44%] shrink-0 snap-start sm:w-[30%] md:w-[23%] lg:w-auto">
            <SportCard sport={sport} count={countsBySport ? (countsBySport[sport.id] ?? 0) : undefined} />
          </li>
        ))}
      </ul>
    </section>
  )
}
