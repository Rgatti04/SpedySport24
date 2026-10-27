import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

export type BadgeTone = 'neutral' | 'brand' | 'accent' | 'success' | 'teal' | 'indigo'

const TONES: Record<BadgeTone, string> = {
  neutral: 'bg-slate-100 text-slate-700 ring-slate-500/15',
  brand: 'bg-brand-50 text-brand-700 ring-brand-600/20',
  accent: 'bg-accent-500 text-brand-950 ring-accent-600/30',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  teal: 'bg-teal-50 text-teal-700 ring-teal-600/20',
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
}

export interface BadgeProps extends ComponentProps<'span'> {
  tone?: BadgeTone
}

export function Badge({ tone = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset',
        TONES[tone],
        className,
      )}
      {...props}
    />
  )
}
