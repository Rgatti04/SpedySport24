import { normalizeText } from './text'

/**
 * Ricerca full-text tollerante agli errori di battitura (lato client, per il prototipo).
 * In produzione lo stesso comportamento si ottiene con Postgres `pg_trgm` / full-text search
 * o un motore dedicato (Meilisearch, Typesense).
 */

const STOP_WORDS = new Set(['a', 'da', 'di', 'del', 'della', 'e', 'il', 'la', 'le', 'lo', 'i', 'gli', 'per', 'con', 'in', 'un', 'una'])

/** Sinonimi e forme comuni → termine presente negli annunci. */
const SYNONYMS: Record<string, string[]> = {
  bike: ['bici'],
  bicicletta: ['bici'],
  biciclette: ['bici'],
  mtb: ['mountain'],
  ski: ['sci'],
  sky: ['sci'],
  paddle: ['padel'],
  pala: ['padel'],
  palla: ['pallone'],
  palle: ['palloni'],
  pesetti: ['manubri'],
  tavola: ['snowboard'],
  tuta: ['completo'],
  running: ['corsa'],
  corsa: ['running'],
}

export interface SearchDocument {
  titleWords: string[]
  words: string[]
}

function splitWords(text: string): string[] {
  return normalizeText(text)
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
}

export function buildSearchDocument(title: string, otherFields: string[]): SearchDocument {
  const titleWords = splitWords(title)
  return { titleWords, words: [...new Set([...titleWords, ...otherFields.flatMap(splitWords)])] }
}

export function tokenizeQuery(query: string): string[] {
  return splitWords(query).filter((token) => !STOP_WORDS.has(token))
}

/** Radice grezza per singolare/plurale e maschile/femminile: "racchette" → "racchett". */
function stem(token: string): string {
  return token.length >= 5 ? token.replace(/[aeiou]$/, '') : token
}

function maxEdits(length: number): number {
  if (length < 4) return 0
  if (length < 7) return 1
  return 2
}

/** Distanza di Damerau-Levenshtein (variante "optimal string alignment"). */
function editDistance(a: string, b: string): number {
  let previousPrevious: number[] = []
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index)

  for (let i = 1; i <= a.length; i++) {
    const current = [i]
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      let value = Math.min((previous[j] ?? 0) + 1, (current[j - 1] ?? 0) + 1, (previous[j - 1] ?? 0) + cost)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        value = Math.min(value, (previousPrevious[j - 2] ?? 0) + 1)
      }
      current[j] = value
    }
    previousPrevious = previous
    previous = current
  }
  return previous[b.length] ?? 0
}

function matchWords(words: readonly string[], variant: string): number {
  let best = 0
  for (const word of words) {
    if (word === variant) return 3
    if (word.startsWith(variant)) best = Math.max(best, 2)
    else if (variant.length >= 4 && word.includes(variant)) best = Math.max(best, 1.5)
  }
  if (best > 0) return best

  const allowed = maxEdits(variant.length)
  if (allowed === 0) return 0
  for (const word of words) {
    if (Math.abs(word.length - variant.length) > allowed + 3) continue
    const distance = Math.min(editDistance(variant, word), editDistance(variant, word.slice(0, variant.length)))
    if (distance <= allowed) return 1
  }
  return 0
}

function scoreToken(document: SearchDocument, token: string): number {
  const variants = [...new Set([token, stem(token), ...(SYNONYMS[token] ?? [])])]
  let best = 0
  for (const variant of variants) {
    const inTitle = matchWords(document.titleWords, variant)
    const anywhere = inTitle > 0 ? inTitle * 1.5 : matchWords(document.words, variant)
    best = Math.max(best, anywhere)
  }
  return best
}

/** Punteggio di pertinenza: 0 se anche un solo termine non trova corrispondenza. */
export function scoreDocument(document: SearchDocument, tokens: readonly string[]): number {
  let total = 0
  for (const token of tokens) {
    const score = scoreToken(document, token)
    if (score === 0) return 0
    total += score
  }
  return total
}
