import { getAttribute, isAttributeKey } from '@/config/attributes'
import { getSubcategory } from '@/config/taxonomy'
import { LISTING_RECORDS, type ListingRecord } from '@/mocks/listings'
import { SELLER_RECORDS } from '@/mocks/sellers'
import type { Listing, Seller } from '@/types'

interface RequestOptions {
  signal?: AbortSignal
}

/**
 * Contratto di accesso ai dati: la UI dipende solo da questa interfaccia.
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

/**
 * Le stesse regole che in produzione applicheranno il form di pubblicazione e il database:
 * attributi coerenti con la sottocategoria, condizioni solo sull'usato.
 */
function getRecordIssues(record: ListingRecord): string[] {
  const issues: string[] = []
  const allowed = new Set(getSubcategory(record.subcategoryId).attributes)

  for (const [key, value] of Object.entries(record.attributes)) {
    if (!isAttributeKey(key) || !allowed.has(key)) {
      issues.push(`attributo "${key}" non previsto per ${record.subcategoryId}`)
      continue
    }
    const definition = getAttribute(key)
    const valid =
      (definition.kind === 'enum' && definition.options.some((option) => option.value === value)) ||
      (definition.kind === 'number' && typeof value === 'number') ||
      (definition.kind === 'boolean' && typeof value === 'boolean')
    if (!valid) issues.push(`valore non valido per "${key}": ${String(value)}`)
  }
  if ((record.offerType === 'usato') !== (record.condition !== null)) {
    issues.push('le condizioni vanno indicate solo (e sempre) per l’usato')
  }
  return issues
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

  if (import.meta.env.DEV) {
    for (const record of LISTING_RECORDS) {
      const issues = getRecordIssues(record)
      if (issues.length > 0) console.error(`Annuncio ${record.id} non valido:`, issues)
    }
  }

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
