import { Camera, Plus, Truck, Wallet, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const STEPS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Camera, title: 'Pubblica in 2 minuti', text: 'Scatta qualche foto, scegli sport, categoria e stato d’usura.' },
  { icon: Truck, title: 'Spedisci in 24h', text: 'Stampa l’etichetta prepagata e consegna al punto di ritiro.' },
  { icon: Wallet, title: 'Ricevi il pagamento', text: 'L’accredito arriva appena l’acquirente conferma la consegna.' },
]

interface SellCtaBannerProps {
  onSellClick: () => void
}

export function SellCtaBanner({ onSellClick }: SellCtaBannerProps) {
  return (
    <section aria-labelledby="sell-title" className="container-page py-16 sm:py-20">
      <div className="relative isolate overflow-hidden rounded-3xl bg-brand-700 px-6 py-10 text-white sm:px-10 lg:px-14 lg:py-14">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 -z-10 size-80 rounded-full bg-brand-500/50 blur-3xl"
        />
        <div aria-hidden="true" className="absolute -bottom-32 left-1/3 -z-10 size-80 rounded-full bg-accent-500/20 blur-3xl" />

        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div>
            <h2 id="sell-title" className="font-display text-3xl font-bold italic leading-tight tracking-tight sm:text-4xl">
              Hai attrezzatura che <span className="text-accent-400">prende polvere?</span>
            </h2>
            <p className="mt-3 max-w-md text-brand-100">
              Trasformala in spazio libero e qualche euro in più. Pubblicare un annuncio è gratis.
            </p>
            <Button variant="accent" size="lg" onClick={onSellClick} className="mt-6">
              <Plus className="size-5" strokeWidth={2.75} aria-hidden="true" />
              Vendi Usato
            </Button>
          </div>

          <ol className="grid gap-4 sm:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, text }, index) => (
              <li key={title} className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-accent-500 text-brand-950">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="font-display text-3xl font-bold italic text-white/25" aria-hidden="true">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-brand-100">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
