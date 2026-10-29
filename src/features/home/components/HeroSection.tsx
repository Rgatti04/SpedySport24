import { ArrowRight, ChevronDown, Eye, Layers, ListFilter, MapPin, Search, Store, Trophy, type LucideIcon } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { buildSearchPath, SEARCH_PATH } from '@/app/paths'
import { Button } from '@/components/ui/Button'
import { PLACE_NAMES } from '@/config/places'
import { isSportId, OFFER_GROUPS, SPORTS } from '@/config/taxonomy'
import { buildImageUrl, buildSrcSet, unsplashPhotoUrl } from '@/lib/images'
import type { SportId } from '@/types'

const HERO_IMAGE = unsplashPhotoUrl('1552674605-db6ffd4facb5')

/** Solo caratteristiche già presenti nel prodotto: nessuna promessa di servizi non ancora attivi. */
const VALUE_POINTS: { icon: LucideIcon; label: string }[] = [
  { icon: ListFilter, label: 'Filtri tecnici per ogni sport' },
  { icon: Store, label: 'Negozi e privati, ben distinti' },
  { icon: Layers, label: 'Nuovo, fine serie e usato' },
  { icon: Eye, label: 'Consultazione libera, senza registrazione' },
]

const CONTROL_CLASSES =
  'h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 text-sm font-medium text-ink transition hover:border-slate-300 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/15'

interface SearchFieldProps {
  id: string
  label: string
  icon: LucideIcon
  children: ReactNode
  className?: string
}

function SearchField({ id, label, icon: Icon, children, className }: SearchFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block px-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-brand-600" aria-hidden="true" />
        {children}
      </div>
    </div>
  )
}

export function HeroSection() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [sport, setSport] = useState<SportId | null>(null)
  const [location, setLocation] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    navigate(buildSearchPath({ query, sport, location }))
  }

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-brand-950">
      <img
        src={buildImageUrl(HERO_IMAGE, { width: 1600, quality: 70 })}
        srcSet={buildSrcSet(HERO_IMAGE, [800, 1200, 1600, 2200])}
        sizes="100vw"
        alt=""
        fetchPriority="high"
        className="absolute inset-0 -z-20 size-full object-cover opacity-60"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-r from-brand-950 via-brand-900/90 to-brand-700/40" />
      {/* Linee di velocità: richiamano il "24" del logo */}
      <div aria-hidden="true" className="pointer-events-none absolute right-8 top-14 hidden flex-col items-end gap-3 lg:flex">
        <span className="h-2.5 w-56 -skew-x-[30deg] rounded-full bg-accent-500" />
        <span className="h-2.5 w-40 -skew-x-[30deg] rounded-full bg-accent-500/75" />
        <span className="h-2.5 w-24 -skew-x-[30deg] rounded-full bg-accent-500/50" />
      </div>

      <div className="container-page py-10 sm:py-14 lg:py-20">
        <div className="max-w-2xl animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-brand-100 ring-1 ring-white/20 backdrop-blur-sm">
            <Trophy className="size-4 text-accent-400" aria-hidden="true" />
            Il marketplace di tutto lo sport
          </p>
          <h1
            id="hero-title"
            className="mt-5 font-display text-4xl font-bold italic leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Tutto lo sport. <span className="whitespace-nowrap text-accent-400">Un solo posto.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-brand-100 sm:text-lg">
            Trova attrezzatura sportiva nuova, fine serie e usata, proposta da negozi e privati in tutta Italia.
          </p>
        </div>

        <form
          role="search"
          aria-label="Cerca attrezzatura"
          onSubmit={handleSubmit}
          className="mt-7 grid animate-fade-up gap-3 rounded-2xl bg-white p-3 shadow-2xl shadow-brand-950/40 [animation-delay:120ms] sm:grid-cols-2 sm:p-4 lg:max-w-5xl lg:grid-cols-[1.6fr_1fr_1fr_auto] lg:items-end"
        >
          <SearchField id="hero-query" label="Cosa cerchi?" icon={Search} className="sm:col-span-2 lg:col-span-1">
            <input
              id="hero-query"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Es. bici gravel, racchetta Babolat, sci 170"
              autoComplete="off"
              enterKeyHint="search"
              className={`${CONTROL_CLASSES} pr-3 placeholder:font-normal placeholder:text-slate-400`}
            />
          </SearchField>

          <SearchField id="hero-sport" label="Sport" icon={Trophy}>
            <select
              id="hero-sport"
              value={sport ?? ''}
              onChange={(event) => setSport(isSportId(event.target.value) ? event.target.value : null)}
              className={`${CONTROL_CLASSES} appearance-none pr-9`}
            >
              <option value="">Tutti gli sport</option>
              {SPORTS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          </SearchField>

          <SearchField id="hero-location" label="Dove" icon={MapPin}>
            <input
              id="hero-location"
              type="text"
              list="hero-place-suggestions"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Città o CAP"
              autoComplete="address-level2"
              className={`${CONTROL_CLASSES} pr-3 placeholder:font-normal placeholder:text-slate-400`}
            />
            <datalist id="hero-place-suggestions">
              {PLACE_NAMES.map((city) => (
                <option key={city} value={city} />
              ))}
            </datalist>
          </SearchField>

          <Button type="submit" variant="accent" size="lg" className="h-12 w-full sm:col-span-2 lg:col-span-1 lg:w-auto">
            <Search className="size-5" strokeWidth={2.5} aria-hidden="true" />
            Cerca attrezzatura
          </Button>
        </form>

        <nav
          aria-label="Ricerca per tipologia"
          className="mt-5 flex animate-fade-up flex-wrap items-center gap-2 [animation-delay:180ms]"
        >
          {OFFER_GROUPS.map((group) => (
            <Link
              key={group.id}
              to={buildSearchPath({ offerGroups: [group.id] })}
              className="rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-white ring-1 ring-white/25 backdrop-blur-sm transition hover:bg-white hover:text-brand-800"
            >
              {group.label}
            </Link>
          ))}
          <Link
            to={SEARCH_PATH}
            className="inline-flex items-center gap-1 rounded-full px-2 py-1.5 text-sm font-semibold text-accent-400 underline-offset-4 hover:underline"
          >
            Ricerca avanzata
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </nav>

        <ul className="mt-8 grid animate-fade-up grid-cols-2 gap-x-6 gap-y-3 text-sm font-medium text-brand-100 [animation-delay:240ms] sm:flex sm:flex-wrap">
          {VALUE_POINTS.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2">
              <Icon className="size-5 shrink-0 text-accent-400" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
