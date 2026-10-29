import { useEffect, useState } from 'react'

/**
 * Campo di testo legato a uno stato esterno (es. URL): l'utente scrive su una bozza locale
 * e il valore viene propagato dopo una breve pausa, senza salti del cursore.
 * Se lo stato esterno cambia da fuori (chip rimossa, reset), la bozza si riallinea.
 */
export function useDebouncedInput(value: string, commit: (next: string) => void, delayMs = 250) {
  const [draft, setDraft] = useState(value)
  const [synced, setSynced] = useState(value)

  // Confronto senza spazi esterni: lo stato esterno li rimuove, la bozza deve conservarli mentre si scrive.
  if (value.trim() !== synced.trim()) {
    setSynced(value)
    setDraft(value)
  }

  useEffect(() => {
    if (draft === synced) return
    const timer = setTimeout(() => {
      setSynced(draft)
      commit(draft)
    }, delayMs)
    return () => clearTimeout(timer)
  }, [draft, synced, commit, delayMs])

  return [draft, setDraft] as const
}

const SITE_NAME = 'SpeedySport24'
const DEFAULT_DESCRIPTION =
  'Trova attrezzatura sportiva nuova, fine serie e usata, proposta da negozi e privati in tutta Italia.'

/** Titolo e descrizione della pagina (in produzione: generati lato server per l'indicizzazione). */
export function usePageMeta(title: string | null, description: string = DEFAULT_DESCRIPTION) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} · Tutto lo sport. Un solo posto.`
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
}
