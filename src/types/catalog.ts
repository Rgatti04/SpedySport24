/**
 * Tassonomia del catalogo. Gli id sono slug stabili, pensati per diventare
 * chiavi primarie/enum lato database (es. tabella `sports` su Supabase).
 */
export type SportId = 'tennis-padel' | 'calcio' | 'ciclismo' | 'basket' | 'fitness' | 'sport-invernali'

export type ProductCategoryId = 'attrezzatura' | 'biciclette' | 'calzature' | 'abbigliamento' | 'accessori'

/** Dal migliore al più usurato. */
export type ConditionId = 'nuovo' | 'come-nuovo' | 'ottimo' | 'buono' | 'usurato'

export interface Sport {
  id: SportId
  label: string
  tagline: string
  imageUrl: string
}

export interface ProductCategory {
  id: ProductCategoryId
  label: string
}

export interface Condition {
  id: ConditionId
  label: string
  description: string
  /** 5 = perfetto, 1 = segni evidenti di utilizzo. */
  score: 1 | 2 | 3 | 4 | 5
}
