import { Share2 } from 'lucide-react'
import { showToast } from '@/components/ui/toastStore'
import { cn } from '@/lib/cn'

interface ShareButtonProps {
  title: string
  className?: string
}

/** Condivisione nativa su smartphone (WhatsApp, Messaggi…), copia del link su desktop. */
export function ShareButton({ title, className }: ShareButtonProps) {
  async function handleShare() {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      showToast('Link dell’annuncio copiato negli appunti.')
    } catch {
      showToast('Non è stato possibile copiare il link: copialo dalla barra degli indirizzi.')
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Condividi annuncio"
      title="Condividi annuncio"
      className={cn(
        'grid size-12 shrink-0 place-items-center rounded-xl border border-slate-300 bg-white text-slate-700 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700',
        className,
      )}
    >
      <Share2 className="size-5" strokeWidth={2.25} aria-hidden="true" />
    </button>
  )
}
