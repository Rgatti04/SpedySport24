import { Compass } from 'lucide-react'
import { Link } from 'react-router'
import { SEARCH_PATH } from '@/app/paths'
import { buttonStyles } from '@/components/ui/buttonStyles'
import { usePageMeta } from '@/lib/hooks'

export function NotFoundContent({ title, text }: { title: string; text: string }) {
  return (
    <div className="container-page flex flex-col items-center py-20 text-center sm:py-28">
      <span className="grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
        <Compass className="size-7" aria-hidden="true" />
      </span>
      <h1 className="mt-4 font-display text-3xl font-bold italic tracking-tight text-ink">{title}</h1>
      <p className="mt-2 max-w-md text-slate-600">{text}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to={SEARCH_PATH} className={buttonStyles({ variant: 'primary' })}>
          Cerca attrezzatura
        </Link>
        <Link to="/" className={buttonStyles({ variant: 'outline' })}>
          Torna alla home
        </Link>
      </div>
    </div>
  )
}

export function NotFoundPage() {
  usePageMeta('Pagina non trovata')
  return <NotFoundContent title="Pagina non trovata" text="Il link potrebbe essere errato o la pagina non esiste più." />
}
