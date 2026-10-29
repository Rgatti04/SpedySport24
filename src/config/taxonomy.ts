import { unsplashPhotoUrl } from '@/lib/images'
import type {
  Condition,
  ConditionId,
  DeliveryMode,
  OfferGroup,
  OfferGroupId,
  OfferType,
  OfferTypeId,
  ProductCategory,
  ProductCategoryId,
  SellerKind,
  Sport,
  SportId,
  Subcategory,
  SubcategoryId,
} from '@/types'

export const SPORTS: readonly Sport[] = [
  {
    id: 'tennis-padel',
    label: 'Tennis & Padel',
    tagline: 'Racchette, scarpe, borse',
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
    label: 'Fitness & Running',
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
  { id: 'calzature', label: 'Calzature' },
  { id: 'abbigliamento', label: 'Abbigliamento' },
  { id: 'accessori', label: 'Accessori' },
]

/** Ogni sottocategoria porta con sé la propria scheda tecnica (e quindi i propri filtri). */
export const SUBCATEGORIES: readonly Subcategory[] = [
  {
    id: 'racchette-tennis',
    sportId: 'tennis-padel',
    categoryId: 'attrezzatura',
    label: 'Racchette da tennis',
    attributes: ['peso-racchetta', 'manico', 'piatto-corde'],
  },
  {
    id: 'racchette-padel',
    sportId: 'tennis-padel',
    categoryId: 'attrezzatura',
    label: 'Racchette da padel',
    attributes: ['forma-padel', 'peso-racchetta'],
  },
  {
    id: 'scarpe-tennis',
    sportId: 'tennis-padel',
    categoryId: 'calzature',
    label: 'Scarpe da tennis e padel',
    attributes: ['numero-scarpe', 'superficie-tennis'],
  },
  {
    id: 'scarpe-calcio',
    sportId: 'calcio',
    categoryId: 'calzature',
    label: 'Scarpe da calcio',
    attributes: ['numero-scarpe', 'superficie-calcio'],
  },
  {
    id: 'palloni-calcio',
    sportId: 'calcio',
    categoryId: 'attrezzatura',
    label: 'Palloni',
    attributes: ['misura-pallone'],
  },
  {
    id: 'abbigliamento-calcio',
    sportId: 'calcio',
    categoryId: 'abbigliamento',
    label: 'Divise e abbigliamento',
    attributes: ['taglia', 'genere'],
  },
  {
    id: 'biciclette',
    sportId: 'ciclismo',
    categoryId: 'attrezzatura',
    label: 'Biciclette',
    attributes: ['tipo-bici', 'taglia-telaio', 'materiale-telaio', 'gruppo', 'ruote', 'freni'],
    comparableBy: 'tipo-bici',
  },
  {
    id: 'abbigliamento-ciclismo',
    sportId: 'ciclismo',
    categoryId: 'abbigliamento',
    label: 'Abbigliamento ciclismo',
    attributes: ['taglia', 'genere'],
  },
  {
    id: 'palloni-basket',
    sportId: 'basket',
    categoryId: 'attrezzatura',
    label: 'Palloni',
    attributes: ['misura-pallone', 'uso-pallone'],
  },
  {
    id: 'canestri',
    sportId: 'basket',
    categoryId: 'attrezzatura',
    label: 'Canestri e tabelloni',
    attributes: [],
  },
  {
    id: 'pesi',
    sportId: 'fitness',
    categoryId: 'attrezzatura',
    label: 'Pesi e bilancieri',
    attributes: ['peso-kg'],
  },
  {
    id: 'accessori-fitness',
    sportId: 'fitness',
    categoryId: 'accessori',
    label: 'Accessori allenamento',
    attributes: [],
  },
  {
    id: 'scarpe-fitness',
    sportId: 'fitness',
    categoryId: 'calzature',
    label: 'Scarpe training e running',
    attributes: ['numero-scarpe'],
  },
  {
    id: 'sci',
    sportId: 'sport-invernali',
    categoryId: 'attrezzatura',
    label: 'Sci',
    attributes: ['lunghezza-sci', 'tipo-sci', 'livello', 'attacchi-inclusi'],
    comparableBy: 'tipo-sci',
  },
  {
    id: 'snowboard',
    sportId: 'sport-invernali',
    categoryId: 'attrezzatura',
    label: 'Snowboard',
    attributes: ['lunghezza-snowboard', 'profilo-tavola', 'attacchi-inclusi'],
  },
  {
    id: 'abbigliamento-neve',
    sportId: 'sport-invernali',
    categoryId: 'abbigliamento',
    label: 'Abbigliamento neve',
    attributes: ['taglia', 'genere'],
  },
]

export const OFFER_GROUPS: readonly OfferGroup[] = [
  {
    id: 'nuovo-fine-serie',
    label: 'Nuovo e fine serie',
    description: 'Dai negozi: novità, rimanenze di magazzino e collezioni precedenti.',
  },
  {
    id: 'mai-usato',
    label: 'Mai usato',
    description: 'Acquistato ma mai utilizzato, oppure usato una o due volte.',
  },
  {
    id: 'usato',
    label: 'Usato',
    description: 'Seconda mano, con condizioni e difetti dichiarati.',
  },
]

export const OFFER_TYPES: readonly OfferType[] = [
  { id: 'nuovo', group: 'nuovo-fine-serie', label: 'Nuovo', description: 'Prodotto nuovo della collezione corrente.' },
  {
    id: 'fine-serie',
    group: 'nuovo-fine-serie',
    label: 'Fine serie',
    description: 'Nuovo, di una collezione precedente o rimanenza di magazzino.',
  },
  {
    id: 'mai-usato',
    group: 'mai-usato',
    label: 'Mai usato',
    description: 'Acquistato ma mai utilizzato, oppure usato al massimo una o due volte.',
  },
  { id: 'usato', group: 'usato', label: 'Usato', description: 'Prodotto di seconda mano.' },
]

export const CONDITIONS: readonly Condition[] = [
  { id: 'come-nuovo', label: 'Come nuovo', description: 'Usato, ma senza segni visibili.', score: 4 },
  {
    id: 'ottimo',
    label: 'Ottime condizioni',
    description: 'Leggeri segni di utilizzo, perfettamente funzionante.',
    score: 3,
  },
  {
    id: 'buono',
    label: 'Buone condizioni',
    description: 'Segni di usura normali, nessun difetto che ne limiti l’uso.',
    score: 2,
  },
  {
    id: 'usurato',
    label: 'Usura evidente',
    description: 'Segni marcati di utilizzo, ma ancora pienamente utilizzabile.',
    score: 1,
  },
]

export const SELLER_KINDS: readonly { id: SellerKind; label: string; pluralLabel: string }[] = [
  { id: 'negozio', label: 'Negozio', pluralLabel: 'Negozi' },
  { id: 'privato', label: 'Privato', pluralLabel: 'Privati' },
]

export const DELIVERY_MODES: readonly { id: DeliveryMode; label: string }[] = [
  { id: 'spedizione', label: 'Con spedizione' },
  { id: 'ritiro', label: 'Ritiro di persona' },
]

const sportsById = new Map(SPORTS.map((sport) => [sport.id, sport]))
const categoriesById = new Map(PRODUCT_CATEGORIES.map((category) => [category.id, category]))
const subcategoriesById = new Map(SUBCATEGORIES.map((subcategory) => [subcategory.id, subcategory]))
const offerGroupsById = new Map(OFFER_GROUPS.map((group) => [group.id, group]))
const offerTypesById = new Map(OFFER_TYPES.map((type) => [type.id, type]))
const conditionsById = new Map(CONDITIONS.map((condition) => [condition.id, condition]))

export function getSport(id: SportId): Sport {
  return sportsById.get(id)!
}

export function getCategory(id: ProductCategoryId): ProductCategory {
  return categoriesById.get(id)!
}

export function getSubcategory(id: SubcategoryId): Subcategory {
  return subcategoriesById.get(id)!
}

export function getSubcategoriesOf(sportId: SportId): Subcategory[] {
  return SUBCATEGORIES.filter((subcategory) => subcategory.sportId === sportId)
}

export function getOfferGroup(id: OfferGroupId): OfferGroup {
  return offerGroupsById.get(id)!
}

export function getOfferType(id: OfferTypeId): OfferType {
  return offerTypesById.get(id)!
}

export function getCondition(id: ConditionId): Condition {
  return conditionsById.get(id)!
}

export function getSellerKindLabel(kind: SellerKind): string {
  return kind === 'negozio' ? 'Negozio' : 'Privato'
}

export function isSportId(value: unknown): value is SportId {
  return typeof value === 'string' && sportsById.has(value as SportId)
}

export function isCategoryId(value: unknown): value is ProductCategoryId {
  return typeof value === 'string' && categoriesById.has(value as ProductCategoryId)
}

export function isSubcategoryId(value: unknown): value is SubcategoryId {
  return typeof value === 'string' && subcategoriesById.has(value as SubcategoryId)
}

export function isOfferGroupId(value: unknown): value is OfferGroupId {
  return typeof value === 'string' && offerGroupsById.has(value as OfferGroupId)
}

export function isConditionId(value: unknown): value is ConditionId {
  return typeof value === 'string' && conditionsById.has(value as ConditionId)
}

export function isSellerKind(value: unknown): value is SellerKind {
  return value === 'privato' || value === 'negozio'
}

export function isDeliveryMode(value: unknown): value is DeliveryMode {
  return value === 'spedizione' || value === 'ritiro'
}
