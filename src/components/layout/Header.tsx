import { Heart, Plus, Search, UserRound, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useMatch, useNavigate } from 'react-router'
import { buildSearchPath, COMING_SOON, FAVORITES_PATH, SEARCH_PATH } from '@/app/paths'
import { Button } from '@/components/ui/Button'
import { buttonStyles } from '@/components/ui/buttonStyles'
import { Logo } from '@/components/ui/Logo'
import { showToast } from '@/components/ui/toastStore'
import { useFavorites } from '@/features/listings/hooks/useFavorites'
import { useListingFilters } from '@/features/listings/hooks/useListingFilters'
import { useDebouncedInput } from '@/lib/hooks'

export function Header() {
  const { favoriteIds } = useFavorites()
  const isSearchPage = useMatch(SEARCH_PATH) !== null

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/85">
      <div className="container-page flex flex-wrap items-center gap-x-3 gap-y-2.5 py-2.5 sm:gap-x-6 sm:py-3">
        <Logo className="order-1" />

        <div className="order-3 w-full md:order-2 md:w-auto md:flex-1">
          {/* Nella pagina di ricerca il campo è legato ai filtri (risultati in tempo reale). */}
          {isSearchPage ? <LiveSearchField /> : <GlobalSearchField />}
        </div>

        <nav aria-label="Account" className="order-2 ml-auto flex items-center gap-0.5 sm:gap-2 md:order-3 md:ml-0">
          <Button variant="ghost" onClick={() => showToast(COMING_SOON.login)} className="px-2.5 sm:px-3">
            <UserRound className="size-5" aria-hidden="true" />
            <span className="sr-only lg:not-sr-only">Accedi</span>
          </Button>
          <Link to={FAVORITES_PATH} className={buttonStyles({ variant: 'ghost', className: 'relative px-2.5 sm:px-3' })}>
            <Heart className="size-5" aria-hidden="true" />
            <span className="sr-only lg:not-sr-only">Preferiti</span>
            {favoriteIds.size > 0 && (
              <span className="absolute right-1 top-1 grid min-w-4.5 place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-bold leading-4.5 text-white lg:static lg:ml-0.5">
                {favoriteIds.size}
                <span className="sr-only"> salvati</span>
              </span>
            )}
          </Link>
          <Button variant="accent" onClick={() => showToast(COMING_SOON.sell)} className="ml-1 px-3 sm:ml-0 sm:px-5">
            <Plus className="size-5" strokeWidth={2.75} aria-hidden="true" />
            <span>
              Vendi<span className="hidden xl:inline"> il tuo sport</span>
            </span>
          </Button>
        </nav>
      </div>
    </header>
  )
}

function GlobalSearchField() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  return (
    <SearchField
      value={query}
      onChange={setQuery}
      onSubmit={() => {
        navigate(buildSearchPath({ query }))
        setQuery('')
      }}
    />
  )
}

function LiveSearchField() {
  const { filters, setFilter } = useListingFilters()
  const commit = useCallback((query: string) => setFilter('query', query), [setFilter])
  const [draft, setDraft] = useDebouncedInput(filters.query, commit)

  return <SearchField value={draft} onChange={setDraft} onSubmit={() => commit(draft)} />
}

interface SearchFieldProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
}

function SearchField({ value, onChange, onSubmit }: SearchFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  // Scorciatoia "/" per andare alla ricerca (come GitHub, YouTube…).
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return
      event.preventDefault()
      inputRef.current?.focus()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault()
        inputRef.current?.blur()
        onSubmit()
      }}
    >
      <label htmlFor="header-search" className="sr-only">
        Cerca attrezzatura sportiva
      </label>
      <div className="relative mx-auto max-w-2xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input
          ref={inputRef}
          id="header-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Cerca per sport, marca, modello…"
          autoComplete="off"
          enterKeyHint="search"
          className="h-11 w-full rounded-full border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm text-ink transition placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/15 [&::-webkit-search-cancel-button]:hidden"
        />
        {value ? (
          <button
            type="button"
            onClick={() => {
              onChange('')
              inputRef.current?.focus()
            }}
            className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
            aria-label="Cancella ricerca"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        ) : (
          <kbd
            className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-slate-200 bg-white px-2 py-0.5 font-sans text-xs font-medium text-slate-400 md:block"
            aria-hidden="true"
          >
            /
          </kbd>
        )}
      </div>
    </form>
  )
}
