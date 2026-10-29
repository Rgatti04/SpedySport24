/**
 * Tassonomia del catalogo. Gli id sono slug stabili, pensati per diventare chiavi primarie/enum
 * lato database (tabelle `sports`, `subcategories`, `attribute_definitions`).
 */
export type SportId = 'tennis-padel' | 'calcio' | 'ciclismo' | 'basket' | 'fitness' | 'sport-invernali'

/** Macro-categoria trasversale agli sport. */
export type ProductCategoryId = 'attrezzatura' | 'calzature' | 'abbigliamento' | 'accessori'

/** Sottocategoria di uno sport: stabilisce quali attributi tecnici ha la scheda prodotto. */
export type SubcategoryId =
  | 'racchette-tennis'
  | 'racchette-padel'
  | 'scarpe-tennis'
  | 'scarpe-calcio'
  | 'palloni-calcio'
  | 'abbigliamento-calcio'
  | 'biciclette'
  | 'abbigliamento-ciclismo'
  | 'palloni-basket'
  | 'canestri'
  | 'pesi'
  | 'accessori-fitness'
  | 'scarpe-fitness'
  | 'sci'
  | 'snowboard'
  | 'abbigliamento-neve'

/** Attributi tecnici specifici (vedi `config/attributes.ts`). */
export type AttributeKey =
  | 'peso-racchetta'
  | 'manico'
  | 'piatto-corde'
  | 'forma-padel'
  | 'superficie-tennis'
  | 'numero-scarpe'
  | 'superficie-calcio'
  | 'misura-pallone'
  | 'uso-pallone'
  | 'tipo-bici'
  | 'taglia-telaio'
  | 'materiale-telaio'
  | 'gruppo'
  | 'ruote'
  | 'freni'
  | 'taglia'
  | 'genere'
  | 'peso-kg'
  | 'lunghezza-sci'
  | 'tipo-sci'
  | 'livello'
  | 'lunghezza-snowboard'
  | 'profilo-tavola'
  | 'attacchi-inclusi'

/** Tipologia di offerta dell'annuncio. */
export type OfferTypeId = 'nuovo' | 'fine-serie' | 'mai-usato' | 'usato'

/** Raggruppamento usato nella ricerca: A. nuovo e fine serie · B. mai usato · C. usato. */
export type OfferGroupId = 'nuovo-fine-serie' | 'mai-usato' | 'usato'

/** Condizioni effettive, solo per l'usato. Dal migliore al più usurato. */
export type ConditionId = 'come-nuovo' | 'ottimo' | 'buono' | 'usurato'

export type SellerKind = 'privato' | 'negozio'

export type DeliveryMode = 'spedizione' | 'ritiro'

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

export interface Subcategory {
  id: SubcategoryId
  sportId: SportId
  categoryId: ProductCategoryId
  label: string
  /** Attributi della scheda tecnica, nell'ordine di visualizzazione. */
  attributes: readonly AttributeKey[]
  /** Attributo che rende due annunci davvero confrontabili per il prezzo (es. tipologia di bici). */
  comparableBy?: AttributeKey
}

export interface AttributeOption {
  value: string
  label: string
}

interface AttributeDefinitionBase {
  key: AttributeKey
  label: string
}

export type AttributeDefinition =
  | (AttributeDefinitionBase & { kind: 'enum'; options: readonly AttributeOption[] })
  | (AttributeDefinitionBase & { kind: 'number'; unit: string; min: number; max: number; step: number })
  | (AttributeDefinitionBase & { kind: 'boolean' })

export interface OfferGroup {
  id: OfferGroupId
  label: string
  description: string
}

export interface OfferType {
  id: OfferTypeId
  group: OfferGroupId
  label: string
  description: string
}

export interface Condition {
  id: ConditionId
  label: string
  description: string
  /** 4 = nessun segno visibile, 1 = usura evidente. */
  score: 1 | 2 | 3 | 4
}
