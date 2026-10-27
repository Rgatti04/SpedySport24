const FOOTER_COLUMNS = [
  {
    title: 'Compra',
    links: ['Come funziona', 'Spedizione rapida 24h', 'Pagamento protetto', 'Garanzia acquisti'],
  },
  {
    title: 'Vendi',
    links: ['Inizia a vendere', 'Consigli per le foto', 'Tariffe', 'Stato d’usura: la guida'],
  },
  {
    title: 'Speedy Sport 24',
    links: ['Chi siamo', 'Centro assistenza', 'Termini e condizioni', 'Privacy e cookie'],
  },
] as const

const CURRENT_YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="bg-brand-950 text-brand-100">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div>
          <p className="font-display text-2xl font-bold italic tracking-tight text-white">
            Speedy Sport <span className="text-accent-500">24</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-brand-200">
            Il marketplace tra privati dell’usato sportivo. Dai nuova vita all’attrezzatura che non usi più e trova
            quella giusta per la tua prossima sfida.
          </p>
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="text-sm font-semibold text-white">{column.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="rounded text-sm text-brand-200 transition-colors hover:text-accent-400 focus-visible:outline-accent-400"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-brand-300 sm:flex-row sm:items-center sm:justify-between">
          <p>© {CURRENT_YEAR} Speedy Sport 24 · Prototipo vetrina MVP con dati dimostrativi.</p>
          <p>Foto: Unsplash</p>
        </div>
      </div>
    </footer>
  )
}
