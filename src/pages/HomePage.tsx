import { AlertTriangle, RotateCcw } from 'lucide-react'
import { useMemo } from 'react'
import { buildSearchPath } from '@/app/paths'
import { Button } from '@/components/ui/Button'
import { HeroSection } from '@/features/home/components/HeroSection'
import { NearbySection } from '@/features/home/components/NearbySection'
import { SecondoTempoBand } from '@/features/home/components/SecondoTempoBand'
import { SellCtaBanner } from '@/features/home/components/SellCtaBanner'
import { SellerTypesSection } from '@/features/home/components/SellerTypesSection'
import { SportCategoriesSection } from '@/features/home/components/SportCategoriesSection'
import { ListingRail } from '@/features/listings/components/ListingRail'
import { useListings } from '@/features/listings/hooks/useListings'
import { countBySport, getOfferGroupOf } from '@/features/listings/lib/filterListings'
import { usePageMeta } from '@/lib/hooks'
import type { Listing, ShopSeller } from '@/types'

const RAIL_SIZE = 8

function byRecent(a: Listing, b: Listing) {
  return b.createdAt.localeCompare(a.createdAt)
}

export function HomePage() {
  usePageMeta(null)
  const { listings, status, retry } = useListings()
  const isLoading = status === 'loading'

  const sections = useMemo(() => {
    const active = listings.filter((listing) => listing.status !== 'venduto').sort(byRecent)
    const shops = new Map<string, ShopSeller>()
    for (const listing of active) {
      if (listing.seller.kind === 'negozio') shops.set(listing.seller.id, listing.seller)
    }
    return {
      active,
      fromShops: active.filter((listing) => getOfferGroupOf(listing) === 'nuovo-fine-serie').slice(0, RAIL_SIZE),
      latest: active.slice(0, RAIL_SIZE),
      shops: [...shops.values()],
    }
  }, [listings])

  return (
    <>
      <HeroSection />
      <SportCategoriesSection countsBySport={status === 'success' ? countBySport(listings) : null} />

      {status === 'error' ? (
        <div className="container-page pt-14">
          <div className="flex flex-col items-center rounded-3xl border-2 border-dashed border-slate-200 bg-white px-6 py-12 text-center">
            <AlertTriangle className="size-8 text-brand-600" aria-hidden="true" />
            <p className="mt-3 font-semibold text-ink">Non siamo riusciti a caricare gli annunci</p>
            <p className="mt-1 text-sm text-slate-600">Controlla la connessione e riprova tra qualche istante.</p>
            <Button className="mt-5" onClick={retry}>
              <RotateCcw className="size-4" aria-hidden="true" />
              Riprova
            </Button>
          </div>
        </div>
      ) : (
        <>
          <ListingRail
            id="dai-negozi"
            title="Nuovo e fine serie dai negozi"
            description="Novità, rimanenze e collezioni precedenti, con le condizioni di vendita del negozio."
            listings={sections.fromShops}
            isLoading={isLoading}
            seeAllTo={buildSearchPath({ offerGroups: ['nuovo-fine-serie'] })}
          />
          <ListingRail
            id="appena-pubblicati"
            title="Appena pubblicati"
            description="Gli ultimi annunci di negozi e privati."
            listings={sections.latest}
            isLoading={isLoading}
            seeAllTo={buildSearchPath({ sort: 'recent' })}
          />
          <NearbySection listings={sections.active} isLoading={isLoading} />
        </>
      )}

      <SellerTypesSection shops={sections.shops} />
      <SecondoTempoBand />
      <SellCtaBanner />
    </>
  )
}
