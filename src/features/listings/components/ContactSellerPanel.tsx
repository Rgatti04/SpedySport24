import { CheckCircle2, MessageCircle, Send } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/Button'
import type { Listing } from '@/types'
import { FavoriteButton } from './FavoriteButton'

const QUICK_MESSAGES = [
  'È ancora disponibile?',
  'Accetteresti un’offerta?',
  'Puoi spedire con Spedizione 24h?',
  'Posso vederlo dal vivo?',
]

type Step = 'idle' | 'composing' | 'sent'

interface ContactSellerPanelProps {
  listing: Listing
  isFavorite: boolean
  onToggleFavorite: () => void
}

export function ContactSellerPanel({ listing, isFavorite, onToggleFavorite }: ContactSellerPanelProps) {
  const [step, setStep] = useState<Step>('idle')
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const sellerName = listing.seller.displayName

  useEffect(() => {
    if (step === 'composing') textareaRef.current?.focus()
  }, [step])

  function startComposing() {
    setMessage(`Ciao ${sellerName.split(' ')[0]}, sono interessato/a a “${listing.title}”. `)
    setStep('composing')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!message.trim()) return
    // Prototipo: qui andrà la chiamata all'API di messaggistica.
    setStep('sent')
  }

  return (
    <div>
      <div className="flex gap-3">
        <Button
          variant="accent"
          size="lg"
          className="h-12 flex-1 text-base"
          onClick={startComposing}
          aria-expanded={step === 'composing'}
          aria-controls="contact-seller-form"
          disabled={step === 'composing'}
        >
          <MessageCircle className="size-5" strokeWidth={2.5} aria-hidden="true" />
          Contatta Venditore
        </Button>
        <FavoriteButton variant="outline" isFavorite={isFavorite} onToggle={onToggleFavorite} />
      </div>

      <AnimatePresence initial={false} mode="wait">
        {step === 'composing' && (
          <motion.form
            key="composing"
            id="contact-seller-form"
            onSubmit={handleSubmit}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <label htmlFor="contact-message" className="text-sm font-semibold text-ink">
                Messaggio per {sellerName}
              </label>
              <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Messaggi rapidi">
                {QUICK_MESSAGES.map((quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => {
                      setMessage((current) => `${current.trimEnd()} ${quick}`.trimStart())
                      textareaRef.current?.focus()
                    }}
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-brand-700 ring-1 ring-brand-200 transition hover:bg-brand-50 hover:ring-brand-300"
                  >
                    {quick}
                  </button>
                ))}
              </div>
              <textarea
                ref={textareaRef}
                id="contact-message"
                rows={4}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="mt-3 w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm text-ink transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-500">Di solito risponde entro {listing.seller.responseTimeHours} h</p>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setStep('idle')}>
                    Annulla
                  </Button>
                  <Button type="submit" size="sm" disabled={!message.trim()}>
                    <Send className="size-4" aria-hidden="true" />
                    Invia
                  </Button>
                </div>
              </div>
            </div>
          </motion.form>
        )}

        {step === 'sent' && (
          <motion.div
            key="sent"
            role="status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex gap-3 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900 ring-1 ring-emerald-200"
          >
            <CheckCircle2 className="size-5 shrink-0 text-emerald-600" aria-hidden="true" />
            <div>
              <p className="font-semibold">Messaggio inviato a {sellerName}!</p>
              <p className="mt-0.5 text-emerald-800">
                Ti avviseremo appena risponde. <span className="text-emerald-700/80">(Demo: nessun messaggio viene realmente inviato.)</span>
              </p>
              <button
                type="button"
                onClick={startComposing}
                className="mt-2 rounded font-semibold text-emerald-700 underline-offset-4 hover:underline"
              >
                Scrivi un altro messaggio
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
