import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { pluralize } from '@/lib/format'

interface MobileFiltersDialogProps {
  open: boolean
  onClose: () => void
  resultCount: number
  activeCount: number
  onReset: () => void
  children: ReactNode
}

/** Pannello filtri a schermo intero su smartphone: i risultati si aggiornano mentre si sceglie. */
export function MobileFiltersDialog({ open, onClose, resultCount, activeCount, onReset, children }: MobileFiltersDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50 lg:hidden">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-brand-950/60 backdrop-blur-sm transition-opacity duration-300 data-closed:opacity-0"
      />
      <div className="fixed inset-0 flex justify-end">
        <DialogPanel
          transition
          className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition duration-300 ease-out data-closed:translate-x-full"
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <DialogTitle className="text-lg font-bold text-ink">Filtri</DialogTitle>
            <button
              type="button"
              onClick={onClose}
              className="grid size-10 place-items-center rounded-full text-slate-600 transition hover:bg-slate-100"
              aria-label="Chiudi filtri"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">{children}</div>

          <div className="flex gap-3 border-t border-slate-200 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <Button variant="ghost" onClick={onReset} disabled={activeCount === 0}>
              Azzera
            </Button>
            <Button className="flex-1" size="lg" onClick={onClose}>
              Mostra {pluralize(resultCount, 'annuncio', 'annunci')}
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
