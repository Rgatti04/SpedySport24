export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Scroll verso una sezione rispettando `prefers-reduced-motion` (l'offset dell'header è in `scroll-padding-top`). */
export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    block: 'start',
  })
}
