import logoUrl from '@/assets/logo-speedy-sport-24.png'
import { cn } from '@/lib/cn'

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <a
      href="/"
      className={cn('inline-flex shrink-0 rounded-lg transition-opacity hover:opacity-90', className)}
      aria-label="Speedy Sport 24 – torna alla home"
    >
      <img src={logoUrl} alt="" width={720} height={167} className="h-9 w-auto sm:h-11" />
    </a>
  )
}
