import { Link } from 'react-router'
import logoUrl from '@/assets/logo-speedy-sport-24.png'
import { cn } from '@/lib/cn'

interface LogoProps {
  className?: string
}

/** Logo con sfondo trasparente: va usato solo su fondi chiari (il wordmark è blu scuro). */
export function Logo({ className }: LogoProps) {
  return (
    <Link
      to="/"
      className={cn('inline-flex shrink-0 rounded-lg transition-opacity hover:opacity-90', className)}
      aria-label="SpeedySport24 – torna alla home"
    >
      <img src={logoUrl} alt="" width={714} height={161} className="h-8 w-auto sm:h-11" />
    </Link>
  )
}
