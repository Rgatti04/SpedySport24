interface ImageSizeOptions {
  width: number
  /** Se indicato, l'immagine viene ritagliata a width × height. */
  height?: number
  quality?: number
}

const UNSPLASH_HOST = 'images.unsplash.com'

/** URL base di una foto Unsplash (le dimensioni si applicano con `buildImageUrl`). */
export function unsplashPhotoUrl(photoId: string): string {
  return `https://${UNSPLASH_HOST}/photo-${photoId}`
}

/**
 * Restituisce l'URL ridimensionato dal CDN quando supportato.
 * Oggi gestisce Unsplash; in futuro qui si aggiunge la trasformazione
 * dello storage scelto (es. Supabase Storage `?width=`), senza toccare i componenti.
 */
export function buildImageUrl(url: string, { width, height, quality = 75 }: ImageSizeOptions): string {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return url
  }
  if (parsed.hostname !== UNSPLASH_HOST) return url

  parsed.searchParams.set('auto', 'format')
  parsed.searchParams.set('fit', 'crop')
  parsed.searchParams.set('w', String(width))
  parsed.searchParams.set('q', String(quality))
  if (height) parsed.searchParams.set('h', String(height))
  return parsed.toString()
}

/** srcset responsivo; `aspectRatio` = larghezza / altezza. */
export function buildSrcSet(url: string, widths: number[], aspectRatio?: number): string {
  return widths
    .map((width) => {
      const height = aspectRatio ? Math.round(width / aspectRatio) : undefined
      return `${buildImageUrl(url, { width, height })} ${width}w`
    })
    .join(', ')
}
