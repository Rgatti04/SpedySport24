import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'accent' | 'outline' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

const BASE =
  'inline-flex select-none items-center justify-center whitespace-nowrap rounded-xl font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600'

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-brand-600 text-white shadow-sm hover:bg-brand-700 active:bg-brand-800',
  accent:
    'bg-accent-500 text-brand-950 shadow-sm shadow-accent-700/20 hover:bg-accent-400 hover:shadow-md hover:shadow-accent-700/25 active:bg-accent-600',
  outline:
    'border border-slate-300 bg-white text-slate-800 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700',
  ghost: 'text-slate-700 hover:bg-slate-100 hover:text-brand-700',
}

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 gap-1.5 px-3 text-sm',
  md: 'h-11 gap-2 px-4 text-sm',
  lg: 'h-12 gap-2 px-6 text-base',
  icon: 'size-11',
}

export function buttonStyles({
  variant = 'primary',
  size = 'md',
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(BASE, VARIANTS[variant], SIZES[size], className)
}
