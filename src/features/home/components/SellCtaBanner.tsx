import { Camera, ClipboardCheck, Plus, Sparkles, type LucideIcon } from 'lucide-react'
import { COMING_SOON } from '@/app/paths'
import { Button } from '@/components/ui/Button'
import { showToast } from '@/components/ui/toastStore'

const STEPS: { icon: LucideIcon; title: string; text: string; comingSoon?: boolean }[] = [
  {
    icon: Camera,
    title: 'Fotografa l’oggetto',
    text: '4–5 foto reali, compresi i dettagli di eventuali difetti.',
  },
  {
    icon: Sparkles,
    title: 'Ricevi una bozza',
    text: 'L’assistente propone sport, categoria, titolo e scheda tecnica. Se non è sicuro, te lo chiede.',
    comingSoon: true,
  },
  {
    icon: ClipboardCheck,
    title: 'Controlli e pubblichi',
    text: 'Niente esce senza la tua approvazione: correggi, completi e pubblichi.',
  },
]

export function SellCtaBanner() {
  return (
    <section aria-labelledby="sell-title" className="container-page pt-14 sm:pt-20">
      <div className="relative isolate overflow-hidden rounded-3xl bg-brand-700 px-6 py-10 text-white sm:px-10 lg:px-14 lg:py-14">
        <div aria-hidden="true" className="absolute -right-24 -top-24 -z-10 size-80 rounded-full bg-brand-500/50 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-32 left-1/3 -z-10 size-80 rounded-full bg-accent-500/20 blur-3xl" />

        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div>
            <h2 id="sell-title" className="font-display text-3xl font-bold italic leading-tight tracking-tight sm:text-4xl">
              Vendi il tuo sport
            </h2>
            <p className="mt-3 max-w-md text-brand-100">
              Privato o negozio, pubblicare dev’essere semplice: poche foto, nessun campo inutile, una scheda tecnica
              completa.
            </p>
            <Button variant="accent" size="lg" onClick={() => showToast(COMING_SOON.sell)} className="mt-6">
              <Plus className="size-5" strokeWidth={2.75} aria-hidden="true" />
              Vendi il tuo sport
            </Button>
          </div>

          <ol className="grid gap-4 sm:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, text, comingSoon }, index) => (
              <li key={title} className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-white text-brand-800">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="font-display text-3xl font-bold italic text-white/25" aria-hidden="true">
                    {index + 1}
                  </span>
                  {comingSoon && (
                    <span className="ml-auto whitespace-nowrap rounded-full bg-accent-500 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-950">
                      In arrivo
                    </span>
                  )}
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
