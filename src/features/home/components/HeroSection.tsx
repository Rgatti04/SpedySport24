import { BadgeCheck, ChevronDown, MapPin, Recycle, Search, ShieldCheck, Tag, Trophy, Zap, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { isCategoryId, isSportId, PRODUCT_CATEGORIES, SPORTS } from '@/config/taxonomy'
import type { SetFilter } from '@/features/listings/hooks/useListingFilters'
import { buildImageUrl, buildSrcSet, unsplashPhotoUrl } from '@/lib/images'
import type { ListingFilters } from '@/types'

const HERO_IMAGE = unsplashPhotoUrl('1552674605-db6ffd4facb5')

const TRUST_POINTS: { icon: LucideIcon; label: string }[] = [
  { icon: Zap, label: 'Spedizione rapida 24h' },
  { icon: ShieldCheck, label: 'Pagamento protetto' },
  { icon: BadgeCheck, label: 'Venditori verificati' },
  { icon: Recycle, label: 'Sport più sostenibile' },
]

const CONTROL_CLASSES =
  'h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 text-sm font-medium text-ink transition hover:border-slate-300 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/15'

interface SearchFieldProps {
  id: string
  label: string
  icon: LucideIcon
  children: ReactNode
}

function SearchField({ id, label, icon: Icon, children }: SearchFieldProps) {
  return (
    <div className="min-w-0">
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

function SelectChevron() {
  return (
    <ChevronDown
      className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
      aria-hidden="true"
    />
  )
}

interface HeroSectionProps {
  filters: ListingFilters
  onFilterChange: SetFilter
  citySuggestions: string[]
  onSubmit: () => void
}

export function HeroSection({ filters, onFilterChange, citySuggestions, onSubmit }: HeroSectionProps) {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-brand-950">
      <img
        src={buildImageUrl(HERO_IMAGE, { width: 1600, quality: 70 })}
        srcSet={buildSrcSet(HERO_IMAGE, [800, 1200, 1600, 2200])}
        sizes="100vw"
        alt=""
        fetchPriority="high"
        className="absolute inset-0 -z-20 size-full object-cover opacity-70"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-r from-brand-950 via-brand-900/85 to-brand-700/30"
      />
      {/* Linee di velocità: richiamano il "24" del logo */}
      <div aria-hidden="true" className="pointer-events-none absolute right-8 top-14 hidden flex-col items-end gap-3 lg:flex">
        <span className="h-2.5 w-56 -skew-x-[30deg] rounded-full bg-accent-500" />
        <span className="h-2.5 w-40 -skew-x-[30deg] rounded-full bg-accent-500/75" />
        <span className="h-2.5 w-24 -skew-x-[30deg] rounded-full bg-accent-500/50" />
      </div>

      <div className="container-page py-12 sm:py-16 lg:py-24">
        <div className="max-w-2xl animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-brand-100 ring-1 ring-white/20 backdrop-blur-sm">
            <Zap className="size-4 fill-accent-400 text-accent-400" aria-hidden="true" />
            Il marketplace dell’usato sportivo
          </p>
          <h1
            id="hero-title"
            className="mt-5 font-display text-4xl font-bold italic leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Dai una seconda vita <span className="text-accent-400">al tuo sport.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-brand-100 sm:text-lg">
            Compra e vendi attrezzatura sportiva usata tra privati: annunci chiari, venditori verificati e spedizione
            rapida in 24h in tutta Italia.
          </p>
        </div>

        <form
          aria-label="Ricerca rapida annunci"
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit()
          }}
          className="mt-8 grid animate-fade-up gap-3 rounded-2xl bg-white p-4 shadow-2xl shadow-brand-950/40 [animation-delay:120ms] sm:grid-cols-2 lg:max-w-5xl lg:grid-cols-[1fr_1fr_1.2fr_auto] lg:items-end"
        >
          <SearchField id="hero-sport" label="Sport" icon={Trophy}>
            <select
              id="hero-sport"
              value={filters.sport ?? ''}
              onChange={(event) => onFilterChange('sport', isSportId(event.target.value) ? event.target.value : null)}
              className={`${CONTROL_CLASSES} appearance-none pr-9`}
            >
              <option value="">Tutti gli sport</option>
              {SPORTS.map((sport) => (
                <option key={sport.id} value={sport.id}>
                  {sport.label}
                </option>
              ))}
            </select>
            <SelectChevron />
          </SearchField>

          <SearchField id="hero-category" label="Categoria" icon={Tag}>
            <select
              id="hero-category"
              value={filters.category ?? ''}
              onChange={(event) =>
                onFilterChange('category', isCategoryId(event.target.value) ? event.target.value : null)
              }
              className={`${CONTROL_CLASSES} appearance-none pr-9`}
            >
              <option value="">Tutte le categorie</option>
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
            <SelectChevron />
          </SearchField>

          <SearchField id="hero-location" label="Città o CAP" icon={MapPin}>
            <input
              id="hero-location"
              type="text"
              inputMode="search"
              list="hero-city-suggestions"
              value={filters.location}
              onChange={(event) => onFilterChange('location', event.target.value)}
              placeholder="Es. Milano o 20135"
              autoComplete="address-level2"
              className={`${CONTROL_CLASSES} pr-3 placeholder:font-normal placeholder:text-slate-400`}
            />
            <datalist id="hero-city-suggestions">
              {citySuggestions.map((city) => (
                <option key={city} value={city} />
              ))}
            </datalist>
          </SearchField>

          <Button type="submit" variant="accent" size="lg" className="h-12 w-full sm:col-span-2 lg:col-span-1 lg:w-auto">
            <Search className="size-5" strokeWidth={2.5} aria-hidden="true" />
            Cerca
          </Button>
        </form>

        <ul className="mt-8 grid animate-fade-up grid-cols-2 gap-x-6 gap-y-3 text-sm font-medium text-brand-100 [animation-delay:240ms] sm:flex sm:flex-wrap">
          {TRUST_POINTS.map(({ icon: Icon, label }) => (
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
