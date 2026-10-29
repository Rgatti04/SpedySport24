import { LocateFixed, MapPin } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { buildSearchPath } from '@/app/paths'
import { Button } from '@/components/ui/Button'
import { distanceKm, PLACE_NAMES, resolvePlace, type Place } from '@/config/places'
import { ListingRail } from '@/features/listings/components/ListingRail'
import { setPreferredPlace, usePreferredPlace } from '@/features/listings/hooks/usePreferredPlace'
import { locateNearestPlace } from '@/lib/geolocation'
import type { Listing } from '@/types'

const NEARBY_RADIUS_KM = 100
const MAX_ITEMS = 8

interface NearbySectionProps {
  listings: readonly Listing[]
  isLoading: boolean
}

export function NearbySection({ listings, isLoading }: NearbySectionProps) {
  const place = usePreferredPlace()
  const [isEditing, setIsEditing] = useState(false)
  const showPicker = place === null || isEditing

  const nearby = place
    ? listings
        .map((listing) => ({ listing, distance: distanceKm(place, listing.location) }))
        .filter(({ distance }) => distance <= NEARBY_RADIUS_KM)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, MAX_ITEMS)
        .map(({ listing }) => listing)
    : []

  return (
    <ListingRail
      id="vicino-a-te"
      title={place && !isEditing ? `Vicino a ${place.city}` : 'Vicino a te'}
      description={
        place && !isEditing
          ? `Annunci entro ${NEARBY_RADIUS_KM} km, dal più vicino.`
          : 'Scegli la tua zona: la ricordiamo solo su questo dispositivo.'
      }
      listings={showPicker ? [] : nearby}
      isLoading={isLoading && !showPicker}
      origin={place}
      seeAllTo={place ? buildSearchPath({ location: place.city, radiusKm: NEARBY_RADIUS_KM, sort: 'distance' }) : undefined}
      actions={
        place &&
        !isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-md text-sm font-semibold text-slate-600 underline-offset-4 hover:text-brand-700 hover:underline"
          >
            Cambia zona
          </button>
        )
      }
      emptyState={
        showPicker ? (
          <PlacePicker
            current={place}
            onPick={(picked) => {
              setPreferredPlace(picked)
              setIsEditing(false)
            }}
            onCancel={place ? () => setIsEditing(false) : undefined}
          />
        ) : (
          <p className="rounded-2xl border-2 border-dashed border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-600">
            Nessun annuncio entro {NEARBY_RADIUS_KM} km da {place?.city}.{' '}
            <Link to={buildSearchPath()} className="font-semibold text-brand-700 underline-offset-4 hover:underline">
              Cerca in tutta Italia
            </Link>
          </p>
        )
      }
    />
  )
}

interface PlacePickerProps {
  current: Place | null
  onPick: (place: Place) => void
  onCancel?: () => void
}

function PlacePicker({ current, onPick, onCancel }: PlacePickerProps) {
  const [value, setValue] = useState(current?.city ?? '')
  const [error, setError] = useState<string | null>(null)
  const [isLocating, setIsLocating] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const place = resolvePlace(value)
    if (place) onPick(place)
    else setError('Non riconosco questa località: prova con il capoluogo di provincia o un CAP.')
  }

  function handleLocate() {
    setIsLocating(true)
    setError(null)
    locateNearestPlace()
      .then(onPick)
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Impossibile rilevare la posizione.'))
      .finally(() => setIsLocating(false))
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80 sm:p-6 md:flex-row md:items-end"
    >
      <div className="min-w-0 flex-1">
        <label htmlFor="nearby-place" className="mb-1.5 block text-sm font-semibold text-ink">
          La tua città o il tuo CAP
        </label>
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-brand-600" aria-hidden="true" />
          <input
            id="nearby-place"
            type="text"
            list="nearby-place-suggestions"
            value={value}
            onChange={(event) => {
              setValue(event.target.value)
              setError(null)
            }}
            placeholder="Es. Bergamo o 24121"
            autoComplete="address-level2"
            aria-invalid={error !== null}
            aria-describedby={error ? 'nearby-place-error' : undefined}
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-medium text-ink transition placeholder:font-normal placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/15"
          />
          <datalist id="nearby-place-suggestions">
            {PLACE_NAMES.map((city) => (
              <option key={city} value={city} />
            ))}
          </datalist>
        </div>
        {error && (
          <p id="nearby-place-error" role="alert" className="mt-2 text-sm text-rose-700">
            {error}
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" size="lg">
          Mostra annunci vicini
        </Button>
        <Button variant="outline" size="lg" onClick={handleLocate} disabled={isLocating}>
          <LocateFixed className="size-4.5" aria-hidden="true" />
          {isLocating ? 'Rilevamento…' : 'Usa la mia posizione'}
        </Button>
        {onCancel && (
          <Button variant="ghost" size="lg" onClick={onCancel}>
            Annulla
          </Button>
        )}
      </div>
    </form>
  )
}
