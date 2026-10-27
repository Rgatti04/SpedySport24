import { LISTING_RECORDS, type ListingRecord } from '@/mocks/listings'
import { SELLER_RECORDS } from '@/mocks/sellers'
import type { Listing, Seller } from '@/types'

interface RequestOptions {
  signal?: AbortSignal
}

/**
 * Contratto di accesso ai dati degli annunci: la UI dipende solo da questa interfaccia.
 * Per passare a un backend reale basta fornire un'altra implementazione
 * (es. `createSupabaseListingsRepository(supabase)`), senza toccare hook e componenti.
 */
export interface ListingsRepository {
  list(options?: RequestOptions): Promise<Listing[]>
  getById(id: string, options?: RequestOptions): Promise<Listing | null>
}

const MOCK_LATENCY_MS = 450

function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason)
      return
    }
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
        reject(signal.reason)
      },
      { once: true },
    )
  })
}

/** Equivalente di `select('*, seller:profiles(*)')`: risolve la foreign key del venditore. */
function toListing({ sellerId, ...record }: ListingRecord, sellersById: Map<string, Seller>): Listing {
  const seller = sellersById.get(sellerId)
  if (!seller) {
    throw new Error(`Venditore "${sellerId}" non trovato per l'annuncio "${record.id}"`)
  }
  return { ...record, seller }
}

export function createMockListingsRepository(): ListingsRepository {
  const sellersById = new Map(SELLER_RECORDS.map((seller) => [seller.id, seller]))

  return {
    async list({ signal } = {}) {
      await wait(MOCK_LATENCY_MS, signal)
      return LISTING_RECORDS.map((record) => toListing(record, sellersById))
    },
    async getById(id, { signal } = {}) {
      await wait(MOCK_LATENCY_MS / 2, signal)
      const record = LISTING_RECORDS.find((item) => item.id === id)
      return record ? toListing(record, sellersById) : null
    },
  }
}

/** Unico punto di swap dell'implementazione (mock → API / Supabase / Firebase). */
export const listingsRepository: ListingsRepository = createMockListingsRepository()
