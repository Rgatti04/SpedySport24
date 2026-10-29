import { ChevronRight } from 'lucide-react'
import { Fragment } from 'react'
import { Link } from 'react-router'

export interface Crumb {
  label: string
  to?: string
}

export function Breadcrumbs({ items }: { items: readonly Crumb[] }) {
  return (
    <nav aria-label="Percorso" className="min-w-0">
      <ol className="flex min-w-0 items-center gap-1 overflow-x-auto text-sm text-slate-500 scrollbar-none">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <Fragment key={`${item.label}-${index}`}>
              <li className="shrink-0">
                {item.to && !isLast ? (
                  <Link to={item.to} className="rounded font-medium transition hover:text-brand-700 hover:underline">
                    {item.label}
                  </Link>
                ) : (
                  <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'font-medium text-slate-700' : undefined}>
                    {item.label}
                  </span>
                )}
              </li>
              {!isLast && (
                <li aria-hidden="true" className="shrink-0">
                  <ChevronRight className="size-3.5 text-slate-400" />
                </li>
              )}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
