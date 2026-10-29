import { useEffect } from 'react'
import { createStore, useStore } from '@/lib/store'
import type { Listing } from '@/types'
import { listingsRepository } from '../api/listingsRepository'

export type RequestStatus = 'loading' | 'success' | 'error'

interface ListingsState {
  status: RequestStatus | 'idle'
  listings: Listing[]
  error: Error | null
}

/** Catalogo condiviso tra le pagine: caricato una volta, poi servito dalla memoria. */
const listingsStore = createStore<ListingsState>({ status: 'idle', listings: [], error: null })

function loadListings() {
  listingsStore.set((previous) => ({ ...previous, status: 'loading', error: null }))
  listingsRepository.list().then(
    (listings) => listingsStore.set({ status: 'success', listings, error: null }),
    (error: unknown) =>
      listingsStore.set({
        status: 'error',
        listings: [],
        error: error instanceof Error ? error : new Error('Errore sconosciuto'),
      }),
  )
}

export function useListings() {
  const state = useStore(listingsStore)

  useEffect(() => {
    if (listingsStore.get().status === 'idle') loadListings()
  }, [])

  const status: RequestStatus = state.status === 'idle' ? 'loading' : state.status
  return { status, listings: state.listings, error: state.error, retry: loadListings }
}
