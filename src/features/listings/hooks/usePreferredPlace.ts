import { getPlaceByCity, type Place } from '@/config/places'
import { createStore, readStorage, useStore, writeStorage } from '@/lib/store'

const STORAGE_KEY = 'ss24:preferred-place'

/** Località scelta dall'utente (mai dedotta in silenzio): alimenta "Vicino a te" in home. */
const preferredPlaceStore = createStore<Place | null>(
  readStorage(STORAGE_KEY, (raw) => (typeof raw === 'string' ? getPlaceByCity(raw) : null), null),
)

preferredPlaceStore.subscribe(() => writeStorage(STORAGE_KEY, preferredPlaceStore.get()?.city ?? null))

export function setPreferredPlace(place: Place | null) {
  preferredPlaceStore.set(place)
}

export function usePreferredPlace(): Place | null {
  return useStore(preferredPlaceStore)
}
