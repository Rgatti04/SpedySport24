import { useCallback } from 'react'
import { createStore, readStorage, useStore, writeStorage } from '@/lib/store'

const STORAGE_KEY = 'ss24:favorites'

const favoritesStore = createStore<ReadonlySet<string>>(
  readStorage(
    STORAGE_KEY,
    (raw) => new Set(Array.isArray(raw) ? raw.filter((id): id is string => typeof id === 'string') : []),
    new Set<string>(),
  ),
)

favoritesStore.subscribe(() => writeStorage(STORAGE_KEY, [...favoritesStore.get()]))

function toggleFavorite(id: string) {
  favoritesStore.set((previous) => {
    const next = new Set(previous)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  })
}

/** Preferiti salvati in locale e condivisi tra le pagine. Con gli account diventeranno una tabella `favorites`. */
export function useFavorites() {
  const favoriteIds = useStore(favoritesStore)
  const isFavorite = useCallback((id: string) => favoriteIds.has(id), [favoriteIds])
  return { favoriteIds, isFavorite, toggleFavorite }
}
