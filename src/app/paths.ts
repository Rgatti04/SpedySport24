export { buildSearchPath, SEARCH_PATH } from '@/features/listings/lib/filtersUrl'

export const FAVORITES_PATH = '/preferiti'

export function listingPath(listingId: string): string {
  return `/annuncio/${listingId}`
}

export function shopPath(sellerId: string): string {
  return `/negozio/${sellerId}`
}

/** Funzioni annunciate ma non ancora attive nel prototipo: lo diciamo esplicitamente, senza promesse. */
export const COMING_SOON = {
  login: 'Account e registrazione arriveranno con il backend. Intanto puoi consultare tutto senza registrarti.',
  sell: 'La pubblicazione guidata, con bozza generata dalle foto, è in sviluppo: in questa demo non è ancora attiva.',
} as const
