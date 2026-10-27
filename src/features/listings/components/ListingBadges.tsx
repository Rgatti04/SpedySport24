import { Zap } from 'lucide-react'
import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { getCondition } from '@/config/taxonomy'
import { cn } from '@/lib/cn'
import type { Condition, ConditionId } from '@/types'

const TONE_BY_SCORE: Record<Condition['score'], BadgeTone> = {
  5: 'success',
  4: 'teal',
  3: 'brand',
  2: 'indigo',
  1: 'neutral',
}

export function ConditionBadge({ conditionId, className }: { conditionId: ConditionId; className?: string }) {
  const condition = getCondition(conditionId)
  return (
    <Badge tone={TONE_BY_SCORE[condition.score]} className={className}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {condition.label}
    </Badge>
  )
}

interface FastShippingBadgeProps {
  /** `compact` accorcia l'etichetta quando la card è stretta (mobile e griglia a 3 colonne su tablet). */
  compact?: boolean
  className?: string
}

export function FastShippingBadge({ compact = false, className }: FastShippingBadgeProps) {
  return (
    <Badge tone="accent" className={cn('font-bold uppercase tracking-wide shadow-sm', className)}>
      <Zap className="size-3.5 fill-current" aria-hidden="true" />
      {compact ? (
        <>
          <span className="sr-only">Spedizione rapida 24h</span>
          <span aria-hidden="true">
            <span className="sm:hidden">24h</span>
            <span className="hidden sm:inline lg:hidden">Spedizione 24h</span>
            <span className="hidden lg:inline">Spedizione rapida 24h</span>
          </span>
        </>
      ) : (
        'Spedizione rapida 24h'
      )}
    </Badge>
  )
}

/** Indicatore visivo a 5 tacche dello stato di usura. */
export function ConditionMeter({ conditionId }: { conditionId: ConditionId }) {
  const condition = getCondition(conditionId)
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <ConditionBadge conditionId={conditionId} />
        <span className="text-xs font-medium text-slate-500">{condition.score}/5</span>
      </div>
      <div
        className="mt-3 grid grid-cols-5 gap-1.5"
        role="meter"
        aria-valuemin={1}
        aria-valuemax={5}
        aria-valuenow={condition.score}
        aria-label={`Stato di usura: ${condition.label}`}
      >
        {[1, 2, 3, 4, 5].map((step) => (
          <span
            key={step}
            className={cn(
              'h-2 rounded-full transition-colors',
              step <= condition.score ? 'bg-brand-600' : 'bg-slate-200',
            )}
          />
        ))}
      </div>
      <p className="mt-2 text-sm text-slate-600">{condition.description}</p>
    </div>
  )
}
