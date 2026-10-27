import { Plus, Search, UserRound, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onSearchSubmit: () => void
  onLoginClick: () => void
  onSellClick: () => void
}

export function Header({ searchQuery, onSearchChange, onSearchSubmit, onLoginClick, onSellClick }: HeaderProps) {
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
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="container-page flex flex-wrap items-center gap-x-6 gap-y-3 py-3">
        <Logo className="order-1" />

        <form
          role="search"
          className="order-3 w-full md:order-2 md:w-auto md:flex-1"
          onSubmit={(event) => {
            event.preventDefault()
            inputRef.current?.blur()
            onSearchSubmit()
          }}
        >
          <label htmlFor="header-search" className="sr-only">
            Cerca negli annunci
          </label>
          <div className="relative mx-auto max-w-2xl">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              id="header-search"
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Cerca racchette, bici, scarpe da calcio…"
              autoComplete="off"
              enterKeyHint="search"
              className="h-11 w-full rounded-full border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm text-ink transition placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/15 [&::-webkit-search-cancel-button]:hidden"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  onSearchChange('')
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

        <nav aria-label="Account" className="order-2 ml-auto flex items-center gap-1.5 sm:gap-2 md:order-3 md:ml-0">
          <Button variant="ghost" onClick={onLoginClick} className="px-3">
            <UserRound className="size-5" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">Accedi</span>
          </Button>
          <Button variant="accent" onClick={onSellClick} className="px-3.5 sm:px-5">
            <Plus className="size-5" strokeWidth={2.75} aria-hidden="true" />
            <span>
              Vendi<span className="hidden sm:inline"> Usato</span>
            </span>
          </Button>
        </nav>
      </div>
    </header>
  )
}
