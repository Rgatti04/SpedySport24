/** Minuscolo e senza accenti: "Città" → "citta". Usato per la ricerca full-text lato client. */
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}

export function tokenize(value: string): string[] {
  return normalizeText(value).split(/\s+/).filter(Boolean)
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}
