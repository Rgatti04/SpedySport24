import { useCallback, useEffect, useState } from 'react'
import { listingsRepository } from '../api/listingsRepository'
import type { Listing } from '@/types'

export type RequestStatus = 'loading' | 'success' | 'error'

interface ListingsState {
  status: RequestStatus
  listings: Listing[]
  error: Error | null
}

/** Carica il catalogo dal repository, con gestione di loading/errore e annullamento. */
export function useListings() {
  const [state, setState] = useState<ListingsState>({ status: 'loading', listings: [], error: null })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    listingsRepository
      .list({ signal: controller.signal })
      .then((listings) => setState({ status: 'success', listings, error: null }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setState({
          status: 'error',
          listings: [],
          error: error instanceof Error ? error : new Error('Errore sconosciuto'),
        })
      })

    return () => controller.abort()
  }, [attempt])

  const retry = useCallback(() => {
    setState((prev) => ({ ...prev, status: 'loading', error: null }))
    setAttempt((value) => value + 1)
  }, [])

  return { ...state, retry }
}
