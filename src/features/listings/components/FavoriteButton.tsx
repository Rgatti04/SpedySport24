import { Heart } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'

interface FavoriteButtonProps {
  isFavorite: boolean
  onToggle: () => void
  /** `overlay`: tondo sopra la foto della card; `outline`: affiancato a una CTA. */
  variant?: 'overlay' | 'outline'
  className?: string
}

export function FavoriteButton({ isFavorite, onToggle, variant = 'overlay', className }: FavoriteButtonProps) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      onClick={onToggle}
      aria-pressed={isFavorite}
      aria-label="Salva nei preferiti"
      title={isFavorite ? 'Rimuovi dai preferiti' : 'Salva nei preferiti'}
      className={cn(
        'grid shrink-0 place-items-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600',
        variant === 'overlay' &&
          'size-9 rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur-sm hover:bg-white hover:text-rose-500',
        variant === 'outline' &&
          'size-12 rounded-xl border border-slate-300 bg-white text-slate-700 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-500',
        className,
      )}
    >
      <motion.span
        key={String(isFavorite)}
        initial={isFavorite ? { scale: 0.4 } : false}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        className="grid place-items-center"
      >
        <Heart
          className={cn('size-5', isFavorite && 'fill-rose-500 text-rose-500')}
          strokeWidth={2.25}
          aria-hidden="true"
        />
      </motion.span>
    </motion.button>
  )
}
