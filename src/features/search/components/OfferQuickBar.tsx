import { useMemo } from 'react'
import { OFFER_GROUPS } from '@/config/taxonomy'
import type { SetFilter } from '@/features/listings/hooks/useListingFilters'
import { countFacet, getOfferGroupOf } from '@/features/listings/lib/filterListings'
import type { Listing, ListingFilters, SellerKind } from '@/types'
import { ToggleChip } from './FilterControls'

const SELLER_CHOICES: { value: SellerKind | null; label: string }[] = [
  { value: null, label: 'Tutti i venditori' },
  { value: 'negozio', label: 'Negozi' },
  { value: 'privato', label: 'Privati' },
]

interface OfferQuickBarProps {
  catalog: readonly Listing[]
  filters: ListingFilters
  setFilter: SetFilter
}

/** Le due distinzioni chiave del marketplace, sempre a portata di pollice sopra i risultati. */
export function OfferQuickBar({ catalog, filters, setFilter }: OfferQuickBarProps) {
  const offerCounts = useMemo(
    () => countFacet(catalog, filters, 'offerGroups', (listing) => [getOfferGroupOf(listing)]),
    [catalog, filters],
  )
  const sellerCounts = useMemo(
    () => countFacet(catalog, filters, 'sellerKinds', (listing) => [listing.seller.kind]),
    [catalog, filters],
  )
  const allOffers = [...offerCounts.values()].reduce((total, count) => total + count, 0)
  const selectedSeller = filters.sellerKinds.length === 1 ? filters.sellerKinds[0]! : null

  return (
    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
      <div
        role="group"
        aria-label="Tipologia di offerta"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 scrollbar-none sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-wrap lg:px-0"
      >
        <ToggleChip pressed={filters.offerGroups.length === 0} onClick={() => setFilter('offerGroups', [])} count={allOffers}>
          Tutte le offerte
        </ToggleChip>
        {OFFER_GROUPS.map((group) => {
          const isSelected = filters.offerGroups.includes(group.id)
          return (
            <ToggleChip
              key={group.id}
              pressed={isSelected}
              count={offerCounts.get(group.id) ?? 0}
              onClick={() =>
                setFilter(
                  'offerGroups',
                  isSelected ? filters.offerGroups.filter((id) => id !== group.id) : [...filters.offerGroups, group.id],
                )
              }
            >
              {group.label}
            </ToggleChip>
          )
        })}
      </div>

      <div
        role="group"
        aria-label="Tipo di venditore"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 scrollbar-none sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
      >
        {SELLER_CHOICES.map((choice) => (
          <ToggleChip
            key={choice.label}
            pressed={selectedSeller === choice.value}
            count={choice.value ? (sellerCounts.get(choice.value) ?? 0) : undefined}
            onClick={() => setFilter('sellerKinds', choice.value ? [choice.value] : [])}
          >
            {choice.label}
          </ToggleChip>
        ))}
      </div>
    </div>
  )
}
