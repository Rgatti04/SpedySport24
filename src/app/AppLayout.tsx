import { MotionConfig } from 'motion/react'
import { Outlet, ScrollRestoration, useNavigation } from 'react-router'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { Toast } from '@/components/ui/Toast'

export function AppLayout() {
  const navigation = useNavigation()

  return (
    // Rispetta "Riduci movimento" del sistema operativo per tutte le animazioni.
    <MotionConfig reducedMotion="user">
      <a
        href="#contenuto"
        className="sr-only rounded-lg bg-accent-500 px-4 py-2 font-semibold text-brand-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-70"
      >
        Vai al contenuto
      </a>

      {navigation.state === 'loading' && (
        <div className="fixed inset-x-0 top-0 z-70 h-1 overflow-hidden bg-brand-100" role="progressbar" aria-label="Caricamento pagina">
          <div className="h-full w-1/3 animate-pulse rounded-r-full bg-accent-500" />
        </div>
      )}

      <Header />
      <main id="contenuto" tabIndex={-1} className="min-h-[60dvh] focus:outline-none">
        <Outlet />
      </main>
      <Footer />

      <Toast />
      {/* Il primo ingresso ha sempre chiave "default": senza l'URL nella chiave, un refresh erediterebbe lo scroll di un'altra pagina. */}
      <ScrollRestoration getKey={(location) => (location.key === 'default' ? location.pathname + location.search : location.key)} />
    </MotionConfig>
  )
}
