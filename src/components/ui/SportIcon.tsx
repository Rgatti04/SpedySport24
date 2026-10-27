import { Bike, createLucideIcon, Dumbbell, Goal, MountainSnow, type LucideIcon, type LucideProps } from 'lucide-react'
import type { SportId } from '@/types'

/* Lucide non ha tennis e basket: icone custom nello stesso stile (24×24, stroke 2). */
const TennisBall = createLucideIcon('TennisBall', [
  ['circle', { cx: '12', cy: '12', r: '10', key: 'ball' }],
  ['path', { d: 'M6 4.4a10 10 0 0 1 0 15.2', key: 'seam-left' }],
  ['path', { d: 'M18 4.4a10 10 0 0 0 0 15.2', key: 'seam-right' }],
])

const Basketball = createLucideIcon('Basketball', [
  ['circle', { cx: '12', cy: '12', r: '10', key: 'ball' }],
  ['path', { d: 'M12 2v20', key: 'vertical' }],
  ['path', { d: 'M2 12h20', key: 'horizontal' }],
  ['path', { d: 'M4.9 4.9a10 10 0 0 1 0 14.2', key: 'curve-left' }],
  ['path', { d: 'M19.1 4.9a10 10 0 0 0 0 14.2', key: 'curve-right' }],
])

const ICONS: Record<SportId, LucideIcon> = {
  'tennis-padel': TennisBall,
  calcio: Goal,
  ciclismo: Bike,
  basket: Basketball,
  fitness: Dumbbell,
  'sport-invernali': MountainSnow,
}

interface SportIconProps extends LucideProps {
  sportId: SportId
}

export function SportIcon({ sportId, ...props }: SportIconProps) {
  const Icon = ICONS[sportId]
  return <Icon aria-hidden="true" {...props} />
}
