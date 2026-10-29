/** Mostrato solo durante il primo caricamento di una pagina scaricata a parte. */
export function PageFallback() {
  return (
    <div className="grid min-h-dvh place-items-center bg-surface" role="status" aria-live="polite">
      <span className="flex items-center gap-3 text-sm font-medium text-slate-600">
        <span className="size-5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" aria-hidden="true" />
        Caricamento…
      </span>
    </div>
  )
}
