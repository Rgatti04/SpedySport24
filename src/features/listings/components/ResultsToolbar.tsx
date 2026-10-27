import { Field, Label, Switch } from '@headlessui/react'
import { ArrowUpDown, ChevronDown, X, Zap } from 'lucide-react'
import { getCategory, getSport } from '@/config/taxonomy'
import { pluralize } from '@/lib/format'
import type { ListingFilters } from '@/types'
import type { SetFilter } from '../hooks/useListingFilters'
import { isSortOption, SORT_OPTIONS } from '../lib/filterListings'

interface ActiveChip {
  key: string
  label: string
  onRemove: () => void
}

function getActiveChips(filters: ListingFilters, setFilter: SetFilter): ActiveChip[] {
  const chips: ActiveChip[] = []
  const query = filters.query.trim()
  const location = filters.location.trim()

  if (query) chips.push({ key: 'query', label: `“${query}”`, onRemove: () => setFilter('query', '') })
  if (filters.sport) {
    chips.push({ key: 'sport', label: getSport(filters.sport).label, onRemove: () => setFilter('sport', null) })
  }
  if (filters.category) {
    chips.push({
      key: 'category',
      label: getCategory(filters.category).label,
      onRemove: () => setFilter('category', null),
    })
  }
  if (location) chips.push({ key: 'location', label: location, onRemove: () => setFilter('location', '') })
  if (filters.fastShippingOnly) {
    chips.push({ key: 'fast', label: 'Spedizione 24h', onRemove: () => setFilter('fastShippingOnly', false) })
  }
  return chips
}

interface ResultsToolbarProps {
  resultCount: number
  isLoading: boolean
  filters: ListingFilters
  onFilterChange: SetFilter
  onReset: () => void
}

export function ResultsToolbar({ resultCount, isLoading, filters, onFilterChange, onReset }: ResultsToolbarProps) {
  const chips = getActiveChips(filters, onFilterChange)

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600" aria-live="polite">
          {isLoading ? (
            'Caricamento annunci…'
          ) : (
            <>
              <strong className="font-semibold text-ink">{pluralize(resultCount, 'annuncio', 'annunci')}</strong>{' '}
              {resultCount === 1 ? 'trovato' : 'trovati'}
            </>
          )}
        </p>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <Field className="flex items-center gap-2.5">
            <Switch
              checked={filters.fastShippingOnly}
              onChange={(checked) => onFilterChange('fastShippingOnly', checked)}
              className="group relative inline-flex h-6 w-11 shrink-0 rounded-full bg-slate-300 transition-colors duration-200 data-checked:bg-brand-600 focus:outline-none data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-brand-600"
            >
              <span className="pointer-events-none mt-0.5 ml-0.5 size-5 rounded-full bg-white shadow-sm transition-transform duration-200 group-data-checked:translate-x-5" />
            </Switch>
            <Label className="flex cursor-pointer items-center gap-1 text-sm font-medium text-slate-700">
              <Zap className="size-4 fill-accent-500 text-accent-600" aria-hidden="true" />
              Solo spedizione 24h
            </Label>
          </Field>

          <div className="relative">
            <label htmlFor="sort-listings" className="sr-only">
              Ordina annunci per
            </label>
            <ArrowUpDown
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500"
              aria-hidden="true"
            />
            <select
              id="sort-listings"
              value={filters.sort}
              onChange={(event) => {
                if (isSortOption(event.target.value)) onFilterChange('sort', event.target.value)
              }}
              className="h-10 appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-9 text-sm font-medium text-slate-800 shadow-sm transition hover:border-slate-300 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Filtri attivi</span>
          <ul className="contents">
            {chips.map((chip) => (
              <li key={chip.key}>
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 py-1 pl-3 pr-1 text-sm font-medium text-brand-800 ring-1 ring-inset ring-brand-200">
                  {chip.label}
                  <button
                    type="button"
                    onClick={chip.onRemove}
                    className="grid size-6 place-items-center rounded-full text-brand-600 transition hover:bg-brand-100 hover:text-brand-900"
                    aria-label={`Rimuovi filtro ${chip.label}`}
                  >
                    <X className="size-3.5" aria-hidden="true" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onReset}
            className="rounded-md px-1 text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
          >
            Azzera tutto
          </button>
        </div>
      )}
    </div>
  )
}
