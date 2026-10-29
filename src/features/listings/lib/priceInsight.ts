import { formatAttributeValue, getAttribute } from '@/config/attributes'
import { getOfferGroup, getSubcategory } from '@/config/taxonomy'
import type { Listing } from '@/types'
import { getOfferGroupOf } from './filterListings'

/** Sotto questa soglia non mostriamo una fascia: meglio dirlo che dare un numero poco attendibile. */
export const MIN_COMPARABLES = 3

export interface PriceInsight {
  /** "Racchette da tennis · Usato" — su cosa si basa il confronto. */
  criteria: string
  comparables: Listing[]
  band: { minCents: number; maxCents: number; medianCents: number } | null
  position: 'below' | 'within' | 'above' | null
}

function median(sorted: readonly number[]): number {
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? Math.round(((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2)
    : (sorted[middle] ?? 0)
}

/**
 * Fascia di prezzo degli annunci attivi comparabili (stessa sottocategoria e tipologia d'offerta,
 * più l'attributo che distingue davvero i prodotti, es. bici da corsa vs gravel).
 * Si basa sui prezzi richiesti, non su quelli di vendita: va dichiarato nell'interfaccia.
 */
export function getPriceInsight(listing: Listing, catalog: readonly Listing[]): PriceInsight {
  const subcategory = getSubcategory(listing.subcategoryId)
  const offerGroup = getOfferGroupOf(listing)
  const keyAttribute = subcategory.comparableBy
  const keyValue = keyAttribute ? listing.attributes[keyAttribute] : undefined

  const comparables = catalog.filter(
    (other) =>
      other.id !== listing.id &&
      other.status !== 'venduto' &&
      other.subcategoryId === listing.subcategoryId &&
      getOfferGroupOf(other) === offerGroup &&
      (keyAttribute === undefined || other.attributes[keyAttribute] === keyValue),
  )

  const criteria = [
    subcategory.label,
    keyAttribute && keyValue !== undefined ? formatAttributeValue(getAttribute(keyAttribute), keyValue) : null,
    getOfferGroup(offerGroup).label,
  ]
    .filter(Boolean)
    .join(' · ')

  if (comparables.length < MIN_COMPARABLES) return { criteria, comparables, band: null, position: null }

  const prices = comparables.map((other) => other.priceCents).sort((a, b) => a - b)
  const band = { minCents: prices[0] ?? 0, maxCents: prices.at(-1) ?? 0, medianCents: median(prices) }
  const position =
    listing.priceCents < band.minCents ? 'below' : listing.priceCents > band.maxCents ? 'above' : 'within'

  return { criteria, comparables, band, position }
}
