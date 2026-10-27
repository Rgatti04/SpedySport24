const LOCALE = 'it-IT'

const wholeEuro = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

const centsEuro = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
})

/** I prezzi sono salvati in centesimi (interi) per evitare errori di arrotondamento. */
export function formatPrice(priceCents: number): string {
  return priceCents % 100 === 0 ? wholeEuro.format(priceCents / 100) : centsEuro.format(priceCents / 100)
}

export function discountPercent(priceCents: number, originalPriceCents?: number): number | null {
  if (!originalPriceCents || originalPriceCents <= priceCents) return null
  return Math.round((1 - priceCents / originalPriceCents) * 100)
}

const relativeTime = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto' })

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 60 * 60 * 24 * 365],
  ['month', 60 * 60 * 24 * 30],
  ['week', 60 * 60 * 24 * 7],
  ['day', 60 * 60 * 24],
  ['hour', 60 * 60],
  ['minute', 60],
]

/** "2 giorni fa", "ieri", "3 ore fa"… */
export function formatRelativeDate(isoDate: string, now: Date = new Date()): string {
  const diffSeconds = (new Date(isoDate).getTime() - now.getTime()) / 1000
  for (const [unit, seconds] of RELATIVE_UNITS) {
    if (Math.abs(diffSeconds) >= seconds) {
      return relativeTime.format(Math.round(diffSeconds / seconds), unit)
    }
  }
  return 'adesso'
}

const monthYear = new Intl.DateTimeFormat(LOCALE, { month: 'long', year: 'numeric' })

export function formatMonthYear(isoDate: string): string {
  return monthYear.format(new Date(isoDate))
}

const decimal = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 1 })

export function formatDecimal(value: number): string {
  return decimal.format(value)
}

/** Italiano con plurale semplice: pluralize(1, 'annuncio', 'annunci') → "1 annuncio". */
export function pluralize(count: number, singular: string, plural: string): string {
  return `${count.toLocaleString(LOCALE)} ${count === 1 ? singular : plural}`
}
