import { Link } from 'react-router'
import { buildSearchPath } from '@/app/paths'
import { SPORTS } from '@/config/taxonomy'

const FOOTER_COLUMNS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: 'Sport',
    links: SPORTS.map((sport) => ({ label: sport.label, to: buildSearchPath({ sport: sport.id }) })),
  },
  {
    title: 'Tipologia',
    links: [
      { label: 'Nuovo e fine serie', to: buildSearchPath({ offerGroups: ['nuovo-fine-serie'] }) },
      { label: 'Mai usato', to: buildSearchPath({ offerGroups: ['mai-usato'] }) },
      { label: 'Usato', to: buildSearchPath({ offerGroups: ['usato'] }) },
      { label: 'Secondo Tempo', to: buildSearchPath({ offerGroups: ['mai-usato', 'usato'] }) },
    ],
  },
  {
    title: 'Venditori',
    links: [
      { label: 'Offerte dei negozi', to: buildSearchPath({ sellerKinds: ['negozio'] }) },
      { label: 'Annunci dei privati', to: buildSearchPath({ sellerKinds: ['privato'] }) },
      { label: 'Tutti gli annunci', to: buildSearchPath() },
    ],
  },
]

const CURRENT_YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="mt-16 bg-brand-950 text-brand-100 sm:mt-20">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div>
          <p className="font-display text-2xl font-bold italic tracking-tight text-white">
            SpeedySport<span className="text-accent-500">24</span>
          </p>
          <p className="mt-1 text-sm font-semibold text-accent-400">Tutto lo sport. Un solo posto.</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-brand-200">
            Il marketplace verticale dello sport: attrezzatura nuova, fine serie e usata, da negozi e privati in tutta
            Italia.
          </p>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="text-sm font-semibold text-white">{column.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="rounded text-sm text-brand-200 transition-colors hover:text-accent-400 focus-visible:outline-accent-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-brand-300 sm:flex-row sm:items-center sm:justify-between">
          <p>© {CURRENT_YEAR} SpeedySport24 · Prototipo con dati, negozi e venditori dimostrativi.</p>
          <p>Foto dimostrative: Unsplash</p>
        </div>
      </div>
    </footer>
  )
}
