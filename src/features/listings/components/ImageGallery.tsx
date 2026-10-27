import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion, type Variants } from 'motion/react'
import { useState, type KeyboardEvent } from 'react'
import { cn } from '@/lib/cn'
import { buildImageUrl, buildSrcSet } from '@/lib/images'
import type { ListingImage } from '@/types'

const SWIPE_THRESHOLD_PX = 60

const slideVariants: Variants = {
  enter: (direction: number) => ({ x: direction >= 0 ? '100%' : '-100%', opacity: 0.6 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction >= 0 ? '-25%' : '25%', opacity: 0 }),
}

interface ImageGalleryProps {
  images: ListingImage[]
  title: string
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [[index, direction], setSlide] = useState<[number, number]>([0, 0])
  const count = images.length
  const current = images[index]
  const hasMany = count > 1

  const paginate = (delta: number) => setSlide(([value]) => [(value + delta + count) % count, delta])
  const goTo = (next: number) => setSlide(([value]) => [next, next > value ? 1 : -1])

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!hasMany) return
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      paginate(1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      paginate(-1)
    }
  }

  if (!current) return null

  return (
    <div
      className="flex h-full flex-col bg-slate-950"
      role="region"
      aria-roledescription="carosello"
      aria-label={`Foto di ${title}`}
      onKeyDown={handleKeyDown}
    >
      <div
        className="relative aspect-[4/3] overflow-hidden focus-visible:outline-offset-[-3px] lg:aspect-auto lg:flex-1"
        tabIndex={hasMany ? 0 : undefined}
        aria-label={hasMany ? 'Usa le frecce sinistra e destra per scorrere le foto' : undefined}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={current.id}
            src={buildImageUrl(current.url, { width: 1000 })}
            srcSet={buildSrcSet(current.url, [640, 1000, 1400])}
            sizes="(min-width: 1024px) 560px, 100vw"
            alt={current.alt}
            draggable={false}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            drag={hasMany ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -SWIPE_THRESHOLD_PX) paginate(1)
              else if (info.offset.x > SWIPE_THRESHOLD_PX) paginate(-1)
            }}
            className={cn('absolute inset-0 size-full object-cover', hasMany && 'cursor-grab active:cursor-grabbing')}
          />
        </AnimatePresence>

        {hasMany && (
          <>
            <GalleryArrow side="left" onClick={() => paginate(-1)} />
            <GalleryArrow side="right" onClick={() => paginate(1)} />
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              {index + 1} / {count}
            </span>
            <p className="sr-only" aria-live="polite">
              Foto {index + 1} di {count}: {current.alt}
            </p>
          </>
        )}
      </div>

      {hasMany && (
        <ul className="flex gap-2 overflow-x-auto p-3 scrollbar-none" aria-label="Miniature">
          {images.map((image, imageIndex) => (
            <li key={image.id} className="shrink-0">
              <button
                type="button"
                onClick={() => goTo(imageIndex)}
                aria-label={`Mostra foto ${imageIndex + 1} di ${count}`}
                aria-current={imageIndex === index}
                className={cn(
                  'block size-16 overflow-hidden rounded-lg ring-2 transition sm:size-18',
                  imageIndex === index ? 'ring-accent-500' : 'opacity-60 ring-transparent hover:opacity-100',
                )}
              >
                <img
                  src={buildImageUrl(image.url, { width: 144, height: 144 })}
                  alt=""
                  loading="lazy"
                  className="size-full object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function GalleryArrow({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === 'left' ? 'Foto precedente' : 'Foto successiva'}
      className={cn(
        'absolute top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink shadow-lg backdrop-blur-sm transition hover:scale-105 hover:bg-white',
        side === 'left' ? 'left-3' : 'right-3',
      )}
    >
      <Icon className="size-5" strokeWidth={2.5} aria-hidden="true" />
    </button>
  )
}
