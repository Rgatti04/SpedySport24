import { LocateFixed } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { getAttribute } from '@/config/attributes'
import { PLACE_NAMES, resolvePlace } from '@/config/places'
import {
  CONDITIONS,
  DELIVERY_MODES,
  getSubcategoriesOf,
  getSubcategory,
  isCategoryId,
  isSportId,
  isSubcategoryId,
  PRODUCT_CATEGORIES,
  SPORTS,
} from '@/config/taxonomy'
import type { SetAttributeFilter, SetFilter, UpdateFilters } from '@/features/listings/hooks/useListingFilters'
import { setPreferredPlace } from '@/features/listings/hooks/usePreferredPlace'
import { countFacet, getCategoryOf, RADIUS_OPTIONS } from '@/features/listings/lib/filterListings'
import { locateNearestPlace } from '@/lib/geolocation'
import type { AttributeKey, Listing, ListingFilters, NumberRange } from '@/types'
import { CheckboxList, ChoiceChips, FilterSection, RangeFields, TextFilterField, type FilterOption } from './FilterControls'

function toggle<T>(values: readonly T[], value: T): T[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value]
}

function sum(counts: Map<string, number>): number {
  let total = 0
  for (const value of counts.values()) total += value
  return total
}

export interface FiltersPanelProps {
  /** Prefisso per gli id: il pannello esiste sia nella colonna laterale sia nel pannello mobile. */
  idPrefix: string
  catalog: readonly Listing[]
  filters: ListingFilters
  setFilter: SetFilter
  setAttributeFilter: SetAttributeFilter
  updateFilters: UpdateFilters
}

export function FiltersPanel({ idPrefix, catalog, filters, setFilter, setAttributeFilter, updateFilters }: FiltersPanelProps) {
  const counts = useMemo(
    () => ({
      sport: countFacet(catalog, filters, 'sport', (listing) => [listing.sportId]),
      category: countFacet(catalog, filters, 'category', (listing) => [getCategoryOf(listing)]),
      subcategory: countFacet(catalog, filters, 'subcategory', (listing) => [listing.subcategoryId]),
      conditions: countFacet(catalog, filters, 'conditions', (listing) => (listing.condition ? [listing.condition] : [])),
      brands: countFacet(catalog, filters, 'brands', (listing) => [listing.brand]),
      delivery: countFacet(catalog, filters, 'deliveryModes', (listing) => [
        ...(listing.delivery.shipping ? ['spedizione'] : []),
        ...(listing.delivery.pickup ? ['ritiro'] : []),
      ]),
      available: countFacet(catalog, filters, 'onlyAvailable', (listing) =>
        listing.status === 'disponibile' ? ['disponibile'] : [],
      ),
    }),
    [catalog, filters],
  )

  const commitModel = useCallback((model: string) => setFilter('model', model), [setFilter])
  const subcategory = filters.subcategory ? getSubcategory(filters.subcategory) : null
  const showConditions = filters.offerGroups.length === 0 || filters.offerGroups.includes('usato')

  const sportOptions: FilterOption[] = [
    { value: '', label: 'Tutti', count: sum(counts.sport) },
    ...SPORTS.map((sport) => ({ value: sport.id, label: sport.label, count: counts.sport.get(sport.id) ?? 0 })),
  ]

  const categoryOptions: FilterOption[] = filters.sport
    ? [
        { value: '', label: 'Tutte', count: sum(counts.subcategory) },
        ...getSubcategoriesOf(filters.sport)
          .filter((item) => !filters.category || item.categoryId === filters.category)
          .map((item) => ({ value: item.id, label: item.label, count: counts.subcategory.get(item.id) ?? 0 })),
      ]
    : [
        { value: '', label: 'Tutte', count: sum(counts.category) },
        ...PRODUCT_CATEGORIES.map((item) => ({ value: item.id, label: item.label, count: counts.category.get(item.id) ?? 0 })),
      ]

  const brandOptions: FilterOption[] = [...new Set([...counts.brands.keys(), ...filters.brands])]
    .map((brand) => ({ value: brand, label: brand, count: counts.brands.get(brand) ?? 0 }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'it'))

  return (
    <div>
      <FilterSection title="Sport">
        <ChoiceChips
          name={`${idPrefix}-sport`}
          legend="Sport"
          options={sportOptions}
          value={filters.sport ?? ''}
          onChange={(value) => setFilter('sport', isSportId(value) ? value : null)}
        />
      </FilterSection>

      <FilterSection title="Categoria">
        {filters.sport ? (
          <ChoiceChips
            name={`${idPrefix}-subcategory`}
            legend="Categoria"
            options={categoryOptions}
            value={filters.subcategory ?? ''}
            onChange={(value) => setFilter('subcategory', isSubcategoryId(value) ? value : null)}
          />
        ) : (
          <ChoiceChips
            name={`${idPrefix}-category`}
            legend="Categoria"
            options={categoryOptions}
            value={filters.category ?? ''}
            onChange={(value) => setFilter('category', isCategoryId(value) ? value : null)}
          />
        )}
        {!subcategory && (
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            {filters.sport
              ? 'Scegli una categoria per i filtri tecnici: taglia, materiale, misure…'
              : 'Scegli uno sport per vedere le sue categorie e i filtri tecnici.'}
          </p>
        )}
      </FilterSection>

      {subcategory && subcategory.attributes.length > 0 && (
        <FilterSection title={`Caratteristiche · ${subcategory.label}`}>
          <div className="space-y-5">
            {subcategory.attributes.map((key) => (
              <AttributeFilter
                key={key}
                attributeKey={key}
                idPrefix={idPrefix}
                catalog={catalog}
                filters={filters}
                setAttributeFilter={setAttributeFilter}
              />
            ))}
          </div>
        </FilterSection>
      )}

      <FilterSection title="Prezzo">
        <RangeFields
          idPrefix={`${idPrefix}-price`}
          legend="Prezzo in euro"
          unit="€"
          value={{ min: filters.priceMin, max: filters.priceMax }}
          onChange={({ min, max }) =>
            updateFilters((current) => ({
              ...current,
              priceMin: min === null ? null : Math.round(min),
              priceMax: max === null ? null : Math.round(max),
            }))
          }
        />
      </FilterSection>

      <FilterSection title="Località e distanza">
        <LocationFilter idPrefix={idPrefix} filters={filters} updateFilters={updateFilters} />
      </FilterSection>

      {showConditions && (
        <FilterSection title="Condizioni dell’usato">
          <CheckboxList
            legend="Condizioni dell’usato"
            options={CONDITIONS.map((condition) => ({
              value: condition.id,
              label: condition.label,
              count: counts.conditions.get(condition.id) ?? 0,
            }))}
            selected={filters.conditions}
            onToggle={(value) => {
              const condition = CONDITIONS.find((item) => item.id === value)
              if (condition) setFilter('conditions', toggle(filters.conditions, condition.id))
            }}
          />
          <p className="mt-2 text-xs text-slate-500">Nuovo, fine serie e mai usato restano sempre inclusi.</p>
        </FilterSection>
      )}

      <FilterSection title="Marca e modello">
        {brandOptions.length > 0 ? (
          <CheckboxList
            legend="Marca"
            options={brandOptions}
            selected={filters.brands}
            onToggle={(brand) => setFilter('brands', toggle(filters.brands, brand))}
            initialVisible={6}
          />
        ) : (
          <p className="text-sm text-slate-500">Nessuna marca tra i risultati.</p>
        )}
        <div className="mt-3">
          <TextFilterField
            id={`${idPrefix}-model`}
            label="Modello"
            value={filters.model}
            placeholder="Es. Pure Aero, Nuroad"
            onCommit={commitModel}
          />
        </div>
      </FilterSection>

      <FilterSection title="Consegna">
        <CheckboxList
          legend="Modalità di consegna"
          options={DELIVERY_MODES.map((mode) => ({ value: mode.id, label: mode.label, count: counts.delivery.get(mode.id) ?? 0 }))}
          selected={filters.deliveryModes}
          onToggle={(value) => {
            const mode = DELIVERY_MODES.find((item) => item.id === value)
            if (mode) setFilter('deliveryModes', toggle(filters.deliveryModes, mode.id))
          }}
        />
      </FilterSection>

      <FilterSection title="Disponibilità">
        <CheckboxList
          legend="Disponibilità"
          options={[{ value: 'disponibile', label: 'Solo disponibili subito', count: counts.available.get('disponibile') ?? 0 }]}
          selected={filters.onlyAvailable ? ['disponibile'] : []}
          onToggle={() => setFilter('onlyAvailable', !filters.onlyAvailable)}
        />
        <p className="mt-2 text-xs text-slate-500">Esclude gli annunci già riservati a un altro acquirente.</p>
      </FilterSection>
    </div>
  )
}

interface AttributeFilterProps {
  attributeKey: AttributeKey
  idPrefix: string
  catalog: readonly Listing[]
  filters: ListingFilters
  setAttributeFilter: SetAttributeFilter
}

function AttributeFilter({ attributeKey, idPrefix, catalog, filters, setAttributeFilter }: AttributeFilterProps) {
  const definition = getAttribute(attributeKey)
  const current = filters.attributes[attributeKey]
  const counts = useMemo(
    () =>
      countFacet(catalog, filters, `attr:${attributeKey}`, (listing) => {
        const value = listing.attributes[attributeKey]
        return value === undefined ? [] : [String(value)]
      }),
    [catalog, filters, attributeKey],
  )

  const heading = (
    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">{definition.label}</p>
  )

  if (definition.kind === 'enum') {
    const selected = Array.isArray(current) ? current : []
    const options = definition.options
      .filter((option) => (counts.get(option.value) ?? 0) > 0 || selected.includes(option.value))
      .map((option) => ({ ...option, count: counts.get(option.value) ?? 0 }))
    return (
      <div>
        {heading}
        {options.length > 0 ? (
          <CheckboxList
            legend={definition.label}
            options={options}
            selected={selected}
            onToggle={(value) => setAttributeFilter(attributeKey, toggle(selected, value))}
          />
        ) : (
          <p className="px-2 text-sm text-slate-500">Nessun valore tra i risultati.</p>
        )}
      </div>
    )
  }

  if (definition.kind === 'number') {
    const range: NumberRange = current && current !== true && !Array.isArray(current) ? current : { min: null, max: null }
    const values = [...counts.keys()].map(Number).filter(Number.isFinite)
    const unit = definition.unit || undefined
    return (
      <div>
        {heading}
        <RangeFields
          idPrefix={`${idPrefix}-${attributeKey}`}
          legend={definition.label}
          unit={unit}
          value={range}
          placeholders={
            values.length > 0
              ? { min: `Min ${Math.min(...values)}`, max: `Max ${Math.max(...values)}` }
              : undefined
          }
          onChange={(next) => setAttributeFilter(attributeKey, next.min === null && next.max === null ? null : next)}
        />
      </div>
    )
  }

  return (
    <CheckboxList
      legend={definition.label}
      options={[{ value: 'true', label: definition.label, count: counts.get('true') ?? 0 }]}
      selected={current === true ? ['true'] : []}
      onToggle={() => setAttributeFilter(attributeKey, current === true ? null : true)}
    />
  )
}

interface LocationFilterProps {
  idPrefix: string
  filters: ListingFilters
  updateFilters: UpdateFilters
}

function LocationFilter({ idPrefix, filters, updateFilters }: LocationFilterProps) {
  const [isLocating, setIsLocating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const origin = resolvePlace(filters.location)
  const hasLocation = filters.location.trim() !== ''

  const commitLocation = useCallback(
    (location: string) => updateFilters((current) => ({ ...current, location })),
    [updateFilters],
  )

  function handleLocate() {
    setIsLocating(true)
    setError(null)
    locateNearestPlace()
      .then((place) => {
        setPreferredPlace(place)
        updateFilters((current) => ({ ...current, location: place.city, radiusKm: current.radiusKm ?? 50 }))
      })
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Impossibile rilevare la posizione.'))
      .finally(() => setIsLocating(false))
  }

  let hint = 'Lascia vuoto per cercare in tutta Italia.'
  if (hasLocation && origin && filters.radiusKm !== null) {
    hint = `Distanza in linea d’aria da ${origin.city} (${origin.province}).`
  } else if (hasLocation && origin) {
    hint = `Località riconosciuta: ${origin.city}. Scegli una distanza per includere i dintorni.`
  } else if (hasLocation) {
    hint = 'Ricerca per testo su città, provincia, regione o CAP.'
  }

  return (
    <div className="space-y-3">
      <TextFilterField
        id={`${idPrefix}-location`}
        label="Città, provincia o CAP"
        value={filters.location}
        placeholder="Es. Milano o 20135"
        list={`${idPrefix}-place-suggestions`}
        onCommit={commitLocation}
      />
      <datalist id={`${idPrefix}-place-suggestions`}>
        {PLACE_NAMES.map((city) => (
          <option key={city} value={city} />
        ))}
      </datalist>

      <div>
        <label htmlFor={`${idPrefix}-radius`} className="mb-1 block text-xs font-medium text-slate-500">
          Distanza
        </label>
        <select
          id={`${idPrefix}-radius`}
          value={filters.radiusKm ?? ''}
          disabled={!origin}
          onChange={(event) =>
            updateFilters((current) => ({ ...current, radiusKm: event.target.value ? Number(event.target.value) : null }))
          }
          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-ink transition hover:border-slate-300 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
        >
          <option value="">Solo questa località</option>
          {RADIUS_OPTIONS.map((radius) => (
            <option key={radius} value={radius}>
              Entro {radius} km
            </option>
          ))}
        </select>
      </div>

      <p className="text-xs leading-relaxed text-slate-500">{hint}</p>

      <button
        type="button"
        onClick={handleLocate}
        disabled={isLocating}
        className="inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-brand-700 underline-offset-4 hover:underline disabled:opacity-60"
      >
        <LocateFixed className="size-4" aria-hidden="true" />
        {isLocating ? 'Rilevamento…' : 'Usa la mia posizione'}
      </button>
      {error && (
        <p role="alert" className="text-xs text-rose-700">
          {error}
        </p>
      )}
    </div>
  )
}
