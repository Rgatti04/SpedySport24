import { ArrowUpDown, ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { isSortOption, SORT_OPTIONS, type FilterChip } from '@/features/listings/lib/filterListings'
import { pluralize } from '@/lib/format'
import type { SortOption } from '@/types'

interface ResultsToolbarProps {
  resultCount: number
  isLoading: boolean
  sort: SortOption
  /** L'ordinamento per distanza richiede una località riconosciuta. */
  canSortByDistance: boolean
  chips: readonly FilterChip[]
  onSortChange: (sort: SortOption) => void
  onRemoveChip: (chip: FilterChip) => void
  onReset: () => void
  onOpenFilters: () => void
}

export function ResultsToolbar({
  resultCount,
  isLoading,
  sort,
  canSortByDistance,
  chips,
  onSortChange,
  onRemoveChip,
  onReset,
  onOpenFilters,
}: ResultsToolbarProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onOpenFilters} className="h-10 lg:hidden">
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            Filtri
            {chips.length > 0 && (
              <span className="grid min-w-5 place-items-center rounded-full bg-brand-600 px-1.5 text-xs font-bold leading-5 text-white">
                {chips.length}
              </span>
            )}
          </Button>

          <div className="relative min-w-0 flex-1 sm:flex-none">
            <label htmlFor="sort-listings" className="sr-only">
              Ordina annunci per
            </label>
            <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            <select
              id="sort-listings"
              value={sort}
              onChange={(event) => {
                if (isSortOption(event.target.value)) onSortChange(event.target.value)
              }}
              className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-9 text-sm font-medium text-slate-800 shadow-sm transition hover:border-slate-300 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
            >
              {SORT_OPTIONS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.value === 'distance' && !canSortByDistance}
                >
                  {option.label}
                  {option.value === 'distance' && !canSortByDistance ? ' (indica una località)' : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          </div>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Filtri attivi</span>
          <ul className="contents">
            {chips.map((chip) => (
              <li key={chip.id}>
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 py-1 pl-3 pr-1 text-sm font-medium text-brand-800 ring-1 ring-inset ring-brand-200">
                  {chip.label}
                  <button
                    type="button"
                    onClick={() => onRemoveChip(chip)}
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
