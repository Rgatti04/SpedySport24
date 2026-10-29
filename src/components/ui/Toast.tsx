import { Info, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'
import { dismissToast, useToast } from './toastStore'

const AUTO_DISMISS_MS = 4500

export function Toast() {
  const toast = useToast()

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(dismissToast, AUTO_DISMISS_MS)
    return () => clearTimeout(timer)
  }, [toast])

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-60 flex justify-center px-4 sm:bottom-6"
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl bg-brand-950 py-3 pl-4 pr-2 text-sm text-white shadow-2xl shadow-brand-950/30"
          >
            <Info className="size-5 shrink-0 text-accent-400" aria-hidden="true" />
            <p>{toast.message}</p>
            <button
              type="button"
              onClick={dismissToast}
              className="grid size-8 shrink-0 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Chiudi notifica"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
