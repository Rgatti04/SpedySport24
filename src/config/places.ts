import { normalizeText } from '@/lib/text'
import type { GeoPoint } from '@/types'

export interface Place extends GeoPoint {
  city: string
  province: string
  region: string
  /** Prime tre cifre dei CAP del capoluogo: bastano per riconoscere la zona da un CAP. */
  capPrefix: string
}

/**
 * Mini-gazetteer dei capoluoghi per la ricerca per distanza nel prototipo.
 * In produzione: geocoding (es. PostGIS + tabella comuni ISTAT) lato server.
 */
export const PLACES: readonly Place[] = [
  { city: 'Milano', province: 'MI', region: 'Lombardia', capPrefix: '201', lat: 45.4642, lng: 9.19 },
  { city: 'Monza', province: 'MB', region: 'Lombardia', capPrefix: '209', lat: 45.5845, lng: 9.2744 },
  { city: 'Bergamo', province: 'BG', region: 'Lombardia', capPrefix: '241', lat: 45.6983, lng: 9.6773 },
  { city: 'Brescia', province: 'BS', region: 'Lombardia', capPrefix: '251', lat: 45.5416, lng: 10.2118 },
  { city: 'Como', province: 'CO', region: 'Lombardia', capPrefix: '221', lat: 45.8081, lng: 9.0852 },
  { city: 'Varese', province: 'VA', region: 'Lombardia', capPrefix: '211', lat: 45.8206, lng: 8.8251 },
  { city: 'Pavia', province: 'PV', region: 'Lombardia', capPrefix: '271', lat: 45.1847, lng: 9.1582 },
  { city: 'Sondrio', province: 'SO', region: 'Lombardia', capPrefix: '231', lat: 46.1699, lng: 9.8715 },
  { city: 'Torino', province: 'TO', region: 'Piemonte', capPrefix: '101', lat: 45.0703, lng: 7.6869 },
  { city: 'Cuneo', province: 'CN', region: 'Piemonte', capPrefix: '121', lat: 44.3845, lng: 7.5427 },
  { city: 'Aosta', province: 'AO', region: "Valle d'Aosta", capPrefix: '111', lat: 45.7372, lng: 7.3201 },
  { city: 'Genova', province: 'GE', region: 'Liguria', capPrefix: '161', lat: 44.4056, lng: 8.9463 },
  { city: 'Venezia', province: 'VE', region: 'Veneto', capPrefix: '301', lat: 45.4408, lng: 12.3155 },
  { city: 'Treviso', province: 'TV', region: 'Veneto', capPrefix: '311', lat: 45.6669, lng: 12.243 },
  { city: 'Padova', province: 'PD', region: 'Veneto', capPrefix: '351', lat: 45.4064, lng: 11.8768 },
  { city: 'Vicenza', province: 'VI', region: 'Veneto', capPrefix: '361', lat: 45.5455, lng: 11.5354 },
  { city: 'Verona', province: 'VR', region: 'Veneto', capPrefix: '371', lat: 45.4384, lng: 10.9916 },
  { city: 'Trento', province: 'TN', region: 'Trentino-Alto Adige', capPrefix: '381', lat: 46.0748, lng: 11.1217 },
  { city: 'Bolzano', province: 'BZ', region: 'Trentino-Alto Adige', capPrefix: '391', lat: 46.4983, lng: 11.3548 },
  { city: 'Udine', province: 'UD', region: 'Friuli-Venezia Giulia', capPrefix: '331', lat: 46.0711, lng: 13.2346 },
  { city: 'Trieste', province: 'TS', region: 'Friuli-Venezia Giulia', capPrefix: '341', lat: 45.6495, lng: 13.7768 },
  { city: 'Bologna', province: 'BO', region: 'Emilia-Romagna', capPrefix: '401', lat: 44.4949, lng: 11.3426 },
  { city: 'Modena', province: 'MO', region: 'Emilia-Romagna', capPrefix: '411', lat: 44.6471, lng: 10.9252 },
  { city: 'Parma', province: 'PR', region: 'Emilia-Romagna', capPrefix: '431', lat: 44.8015, lng: 10.3279 },
  { city: 'Firenze', province: 'FI', region: 'Toscana', capPrefix: '501', lat: 43.7696, lng: 11.2558 },
  { city: 'Pisa', province: 'PI', region: 'Toscana', capPrefix: '561', lat: 43.7228, lng: 10.4017 },
  { city: 'Perugia', province: 'PG', region: 'Umbria', capPrefix: '061', lat: 43.1107, lng: 12.3908 },
  { city: 'Ancona', province: 'AN', region: 'Marche', capPrefix: '601', lat: 43.6158, lng: 13.5189 },
  { city: 'Roma', province: 'RM', region: 'Lazio', capPrefix: '001', lat: 41.9028, lng: 12.4964 },
  { city: 'Pescara', province: 'PE', region: 'Abruzzo', capPrefix: '651', lat: 42.4618, lng: 14.2161 },
  { city: 'Napoli', province: 'NA', region: 'Campania', capPrefix: '801', lat: 40.8518, lng: 14.2681 },
  { city: 'Salerno', province: 'SA', region: 'Campania', capPrefix: '841', lat: 40.6824, lng: 14.7681 },
  { city: 'Bari', province: 'BA', region: 'Puglia', capPrefix: '701', lat: 41.1171, lng: 16.8719 },
  { city: 'Lecce', province: 'LE', region: 'Puglia', capPrefix: '731', lat: 40.3515, lng: 18.175 },
  { city: 'Palermo', province: 'PA', region: 'Sicilia', capPrefix: '901', lat: 38.1157, lng: 13.3615 },
  { city: 'Catania', province: 'CT', region: 'Sicilia', capPrefix: '951', lat: 37.5079, lng: 15.083 },
  { city: 'Cagliari', province: 'CA', region: 'Sardegna', capPrefix: '091', lat: 39.2238, lng: 9.1217 },
]

export const PLACE_NAMES: readonly string[] = PLACES.map((place) => place.city).sort((a, b) => a.localeCompare(b, 'it'))

const placesByCity = new Map(PLACES.map((place) => [normalizeText(place.city), place]))

export function getPlaceByCity(city: string): Place | null {
  return placesByCity.get(normalizeText(city)) ?? null
}

/** Riconosce città ("Milano", "mil"), sigla provincia ("MI") o CAP ("20135"). */
export function resolvePlace(input: string): Place | null {
  const needle = normalizeText(input)
  if (!needle) return null

  if (/^\d{3,5}$/.test(needle)) {
    return PLACES.find((place) => place.capPrefix === needle.slice(0, 3)) ?? null
  }

  const exact = placesByCity.get(needle) ?? PLACES.find((place) => normalizeText(place.province) === needle)
  if (exact) return exact

  const byPrefix = PLACES.filter((place) => normalizeText(place.city).startsWith(needle))
  return byPrefix.length === 1 ? byPrefix[0]! : null
}

const EARTH_RADIUS_KM = 6371

/** Distanza in linea d'aria (formula dell'emisenoverso). */
export function distanceKm(a: GeoPoint, b: GeoPoint): number {
  const toRad = (degrees: number) => (degrees * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h))
}

export function nearestPlace(point: GeoPoint): Place {
  let best = PLACES[0]!
  let bestDistance = Infinity
  for (const place of PLACES) {
    const distance = distanceKm(point, place)
    if (distance < bestDistance) {
      best = place
      bestDistance = distance
    }
  }
  return best
}
