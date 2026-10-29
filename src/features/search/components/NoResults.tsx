import { SearchX } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { FilterChip, RelaxSuggestion } from '@/features/listings/lib/filterListings'
import { pluralize } from '@/lib/format'

interface NoResultsProps {
  suggestions: readonly RelaxSuggestion[]
  onApply: (chip: FilterChip) => void
  onReset: () => void
}

/** Zero risultati: invece di un vicolo cieco, indichiamo quale filtro togliere e cosa si ottiene. */
export function NoResults({ suggestions, onApply, onReset }: NoResultsProps) {
  return (
    <div className="flex flex-col items-center rounded-3xl border-2 border-dashed border-slate-200 bg-white px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
        <SearchX className="size-7" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-ink">Nessun annuncio corrisponde a tutti i filtri</h2>

      {suggestions.length > 0 ? (
        <>
          <p className="mt-1 max-w-md text-sm text-slate-600">Togli uno di questi filtri per ritrovare annunci:</p>
          <ul className="mt-5 flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
            {suggestions.map(({ chip, count }) => (
              <li key={chip.id}>
                <Button variant="outline" onClick={() => onApply(chip)} className="h-auto w-full py-2 sm:w-auto">
                  <span>
                    Togli «{chip.label}»{' '}
                    <span className="font-normal text-slate-500">→ {pluralize(count, 'annuncio', 'annunci')}</span>
                  </span>
                </Button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-1 max-w-md text-sm text-slate-600">
          Prova con un termine più generico o amplia la zona di ricerca.
        </p>
      )}

      <Button variant="ghost" onClick={onReset} className="mt-4">
        Azzera tutti i filtri
      </Button>
    </div>
  )
}
