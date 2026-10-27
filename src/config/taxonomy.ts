import { unsplashPhotoUrl } from '@/lib/images'
import type {
  Condition,
  ConditionId,
  ProductCategory,
  ProductCategoryId,
  Sport,
  SportId,
} from '@/types'

export const SPORTS: readonly Sport[] = [
  {
    id: 'tennis-padel',
    label: 'Tennis & Padel',
    tagline: 'Racchette, palline, borse',
    imageUrl: unsplashPhotoUrl('1554068865-24cecd4e34b8'),
  },
  {
    id: 'calcio',
    label: 'Calcio',
    tagline: 'Scarpe, palloni, divise',
    imageUrl: unsplashPhotoUrl('1574629810360-7efbbe195018'),
  },
  {
    id: 'ciclismo',
    label: 'Ciclismo',
    tagline: 'Bici, componenti, abbigliamento',
    imageUrl: unsplashPhotoUrl('1517649763962-0c623066013b'),
  },
  {
    id: 'basket',
    label: 'Basket',
    tagline: 'Palloni, canestri, scarpe',
    imageUrl: unsplashPhotoUrl('1546519638-68e109498ffc'),
  },
  {
    id: 'fitness',
    label: 'Fitness & Palestra',
    tagline: 'Pesi, accessori, scarpe',
    imageUrl: unsplashPhotoUrl('1534438327276-14e5300c3a48'),
  },
  {
    id: 'sport-invernali',
    label: 'Sport Invernali',
    tagline: 'Sci, snowboard, giacche',
    imageUrl: unsplashPhotoUrl('1605540436563-5bca919ae766'),
  },
]

export const PRODUCT_CATEGORIES: readonly ProductCategory[] = [
  { id: 'attrezzatura', label: 'Attrezzatura' },
  { id: 'biciclette', label: 'Biciclette' },
  { id: 'calzature', label: 'Calzature' },
  { id: 'abbigliamento', label: 'Abbigliamento' },
  { id: 'accessori', label: 'Accessori' },
]

export const CONDITIONS: readonly Condition[] = [
  {
    id: 'nuovo',
    label: 'Nuovo con cartellino',
    description: 'Mai utilizzato, con etichette o confezione originale.',
    score: 5,
  },
  {
    id: 'come-nuovo',
    label: 'Come nuovo',
    description: 'Usato pochissime volte, nessun segno visibile.',
    score: 4,
  },
  {
    id: 'ottimo',
    label: 'Ottimo stato',
    description: 'Leggeri segni di utilizzo, perfettamente funzionante.',
    score: 3,
  },
  {
    id: 'buono',
    label: 'Buono stato',
    description: 'Segni di usura normali, nessun difetto che ne limiti l’uso.',
    score: 2,
  },
  {
    id: 'usurato',
    label: 'Segni di usura',
    description: 'Usura evidente ma ancora pienamente utilizzabile.',
    score: 1,
  },
]

const sportsById = new Map(SPORTS.map((sport) => [sport.id, sport]))
const categoriesById = new Map(PRODUCT_CATEGORIES.map((category) => [category.id, category]))
const conditionsById = new Map(CONDITIONS.map((condition) => [condition.id, condition]))

export function getSport(id: SportId): Sport {
  return sportsById.get(id)!
}

export function getCategory(id: ProductCategoryId): ProductCategory {
  return categoriesById.get(id)!
}

export function getCondition(id: ConditionId): Condition {
  return conditionsById.get(id)!
}

export function isSportId(value: unknown): value is SportId {
  return typeof value === 'string' && sportsById.has(value as SportId)
}

export function isCategoryId(value: unknown): value is ProductCategoryId {
  return typeof value === 'string' && categoriesById.has(value as ProductCategoryId)
}
