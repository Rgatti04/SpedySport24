import { Clock, PackageCheck, Sparkles, Store, Tag, UserRound, type LucideIcon } from 'lucide-react'
import { Badge, type BadgeTone } from '@/components/ui/Badge'
import { CONDITIONS, getCondition, getOfferType } from '@/config/taxonomy'
import { cn } from '@/lib/cn'
import type { Condition, ConditionId, ListingStatus, OfferTypeId, SellerKind } from '@/types'

const TONE_BY_SCORE: Record<Condition['score'], BadgeTone> = {
  4: 'success',
  3: 'teal',
  2: 'brand',
  1: 'neutral',
}

const OFFER_ICONS: Record<Exclude<OfferTypeId, 'usato'>, LucideIcon> = {
  nuovo: Sparkles,
  'fine-serie': Tag,
  'mai-usato': PackageCheck,
}

/** Tipologia d'offerta per nuovo, fine serie e mai usato (l'usato mostra le condizioni). */
export function OfferTypeBadge({ offerType, className }: { offerType: Exclude<OfferTypeId, 'usato'>; className?: string }) {
  const Icon = OFFER_ICONS[offerType]
  return (
    <Badge tone={offerType === 'mai-usato' ? 'success' : 'solid'} className={className}>
      <Icon className="size-3.5" aria-hidden="true" />
      {getOfferType(offerType).label}
    </Badge>
  )
}

export function ConditionBadge({ conditionId, className }: { conditionId: ConditionId; className?: string }) {
  const condition = getCondition(conditionId)
  return (
    <Badge tone={TONE_BY_SCORE[condition.score]} className={className}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      Usato · {condition.label.toLowerCase()}
    </Badge>
  )
}

/** Badge unico "stato del prodotto": tipologia per il nuovo, condizioni per l'usato. */
export function ProductStateBadge({
  offerType,
  condition,
  className,
}: {
  offerType: OfferTypeId
  condition: ConditionId | null
  className?: string
}) {
  if (offerType === 'usato') {
    return condition ? <ConditionBadge conditionId={condition} className={className} /> : null
  }
  return <OfferTypeBadge offerType={offerType} className={className} />
}

export function SellerKindBadge({ kind, className }: { kind: SellerKind; className?: string }) {
  const isShop = kind === 'negozio'
  const Icon = isShop ? Store : UserRound
  return (
    <Badge tone={isShop ? 'indigo' : 'neutral'} className={className}>
      <Icon className="size-3.5" aria-hidden="true" />
      {isShop ? 'Negozio' : 'Privato'}
    </Badge>
  )
}

export function StatusBadge({ status, className }: { status: Exclude<ListingStatus, 'disponibile'>; className?: string }) {
  return (
    <Badge tone="inverse" className={cn('font-bold uppercase tracking-wide', className)}>
      <Clock className="size-3.5" aria-hidden="true" />
      {status === 'riservato' ? 'Riservato' : 'Venduto'}
    </Badge>
  )
}

/** Indicatore a 4 tacche delle condizioni dell'usato. */
export function ConditionMeter({ conditionId }: { conditionId: ConditionId }) {
  const condition = getCondition(conditionId)
  const steps = CONDITIONS.length
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <ConditionBadge conditionId={conditionId} />
        <span className="text-xs font-medium text-slate-500">
          {condition.score}/{steps}
        </span>
      </div>
      <div
        className="mt-3 grid grid-cols-4 gap-1.5"
        role="meter"
        aria-valuemin={1}
        aria-valuemax={steps}
        aria-valuenow={condition.score}
        aria-label={`Condizioni: ${condition.label}`}
      >
        {Array.from({ length: steps }, (_, index) => index + 1).map((step) => (
          <span
            key={step}
            className={cn('h-2 rounded-full transition-colors', step <= condition.score ? 'bg-brand-600' : 'bg-slate-200')}
          />
        ))}
      </div>
      <p className="mt-2 text-sm text-slate-600">{condition.description}</p>
    </div>
  )
}
