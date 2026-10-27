import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'ss24:favorites'

function readStoredFavorites(): Set<string> {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')
    return new Set(Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [])
  } catch {
    return new Set()
  }
}

/** Preferiti salvati in locale. Con l'autenticazione diventeranno una tabella `favorites`. */
export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<ReadonlySet<string>>(readStoredFavorites)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...favoriteIds]))
    } catch {
      // Storage non disponibile (navigazione privata, quota piena): i preferiti restano in memoria.
    }
  }, [favoriteIds])

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const isFavorite = useCallback((id: string) => favoriteIds.has(id), [favoriteIds])

  return { favoriteIds, isFavorite, toggleFavorite }
}
