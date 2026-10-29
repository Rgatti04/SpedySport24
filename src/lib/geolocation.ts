import { nearestPlace, type Place } from '@/config/places'

const ERROR_MESSAGES: Record<number, string> = {
  1: 'Permesso di posizione negato: inserisci la città a mano.',
  2: 'Posizione non disponibile in questo momento.',
  3: 'La richiesta di posizione è scaduta: riprova.',
}

/**
 * Chiede la posizione al browser (solo su azione esplicita dell'utente) e la converte
 * nel capoluogo più vicino: le coordinate esatte non vengono salvate né inviate.
 */
export function locateNearestPlace(): Promise<Place> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Il browser non supporta la geolocalizzazione.'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve(nearestPlace({ lat: coords.latitude, lng: coords.longitude })),
      (error) => reject(new Error(ERROR_MESSAGES[error.code] ?? 'Impossibile rilevare la posizione.')),
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 10 * 60_000 },
    )
  })
}
