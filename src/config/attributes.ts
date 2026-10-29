import type { AttributeDefinition, AttributeKey, AttributeOption } from '@/types'

function options(...entries: [value: string, label: string][]): AttributeOption[] {
  return entries.map(([value, label]) => ({ value, label }))
}

/**
 * Definizioni centralizzate degli attributi tecnici: guidano scheda prodotto, filtri,
 * validazione dei dati e, in futuro, il form di pubblicazione e l'assistente IA.
 * Lato database diventano la tabella `attribute_definitions`.
 */
export const ATTRIBUTES: Record<AttributeKey, AttributeDefinition> = {
  'peso-racchetta': { key: 'peso-racchetta', label: 'Peso', kind: 'number', unit: 'g', min: 200, max: 400, step: 5 },
  manico: {
    key: 'manico',
    label: 'Misura manico',
    kind: 'enum',
    options: options(['l0', 'L0'], ['l1', 'L1'], ['l2', 'L2'], ['l3', 'L3'], ['l4', 'L4'], ['l5', 'L5']),
  },
  'piatto-corde': {
    key: 'piatto-corde',
    label: 'Piatto corde',
    kind: 'enum',
    options: options(
      ['fino-97', 'Fino a 97 in² (midplus)'],
      ['98', '98 in²'],
      ['100', '100 in²'],
      ['oltre-100', 'Oltre 100 in² (oversize)'],
    ),
  },
  'forma-padel': {
    key: 'forma-padel',
    label: 'Forma',
    kind: 'enum',
    options: options(['rotonda', 'Rotonda (controllo)'], ['goccia', 'Goccia (equilibrio)'], ['diamante', 'Diamante (potenza)']),
  },
  'superficie-tennis': {
    key: 'superficie-tennis',
    label: 'Superficie',
    kind: 'enum',
    options: options(['all-court', 'Tutti i terreni'], ['terra', 'Terra rossa'], ['cemento', 'Cemento'], ['erba', 'Erba']),
  },
  'numero-scarpe': { key: 'numero-scarpe', label: 'Numero (EU)', kind: 'number', unit: '', min: 28, max: 50, step: 0.5 },
  'superficie-calcio': {
    key: 'superficie-calcio',
    label: 'Superficie',
    kind: 'enum',
    options: options(
      ['fg', 'Erba naturale (FG)'],
      ['ag', 'Erba sintetica (AG)'],
      ['sg', 'Terreno morbido (SG)'],
      ['tf', 'Calcetto, sintetico corto (TF)'],
      ['ic', 'Indoor (IC)'],
    ),
  },
  'misura-pallone': {
    key: 'misura-pallone',
    label: 'Misura',
    kind: 'enum',
    options: options(['3', 'Misura 3'], ['4', 'Misura 4'], ['5', 'Misura 5'], ['6', 'Misura 6'], ['7', 'Misura 7']),
  },
  'uso-pallone': {
    key: 'uso-pallone',
    label: 'Utilizzo',
    kind: 'enum',
    options: options(['indoor', 'Indoor'], ['outdoor', 'Outdoor'], ['indoor-outdoor', 'Indoor e outdoor']),
  },
  'tipo-bici': {
    key: 'tipo-bici',
    label: 'Tipologia',
    kind: 'enum',
    options: options(['corsa', 'Corsa'], ['gravel', 'Gravel'], ['mtb', 'Mountain bike'], ['citta', 'Città e trekking'], ['e-bike', 'E-bike']),
  },
  'taglia-telaio': {
    key: 'taglia-telaio',
    label: 'Taglia telaio',
    kind: 'enum',
    options: options(
      ['xs', 'XS · fino a 160 cm'],
      ['s', 'S · 160–170 cm'],
      ['m', 'M · 170–178 cm'],
      ['l', 'L · 178–186 cm'],
      ['xl', 'XL · oltre 186 cm'],
    ),
  },
  'materiale-telaio': {
    key: 'materiale-telaio',
    label: 'Materiale telaio',
    kind: 'enum',
    options: options(['carbonio', 'Carbonio'], ['alluminio', 'Alluminio'], ['acciaio', 'Acciaio'], ['titanio', 'Titanio']),
  },
  gruppo: {
    key: 'gruppo',
    label: 'Gruppo',
    kind: 'enum',
    options: options(
      ['shimano-105', 'Shimano 105'],
      ['shimano-ultegra', 'Shimano Ultegra'],
      ['shimano-grx', 'Shimano GRX'],
      ['shimano-deore', 'Shimano Deore'],
      ['sram', 'SRAM'],
      ['campagnolo', 'Campagnolo'],
      ['single-speed', 'Single speed'],
      ['altro', 'Altro'],
    ),
  },
  ruote: {
    key: 'ruote',
    label: 'Ruote',
    kind: 'enum',
    options: options(['26', '26"'], ['27-5', '27,5"'], ['29', '29"'], ['700c', '28" / 700c']),
  },
  freni: {
    key: 'freni',
    label: 'Freni',
    kind: 'enum',
    options: options(['disco-idraulici', 'A disco idraulici'], ['disco-meccanici', 'A disco meccanici'], ['pattino', 'A pattino']),
  },
  taglia: {
    key: 'taglia',
    label: 'Taglia',
    kind: 'enum',
    options: options(['xs', 'XS'], ['s', 'S'], ['m', 'M'], ['l', 'L'], ['xl', 'XL'], ['xxl', 'XXL'], ['junior', 'Junior']),
  },
  genere: {
    key: 'genere',
    label: 'Genere',
    kind: 'enum',
    options: options(['uomo', 'Uomo'], ['donna', 'Donna'], ['unisex', 'Unisex'], ['bambino', 'Bambino/a']),
  },
  'peso-kg': { key: 'peso-kg', label: 'Peso', kind: 'number', unit: 'kg', min: 1, max: 200, step: 1 },
  'lunghezza-sci': { key: 'lunghezza-sci', label: 'Lunghezza', kind: 'number', unit: 'cm', min: 100, max: 200, step: 1 },
  'tipo-sci': {
    key: 'tipo-sci',
    label: 'Tipologia',
    kind: 'enum',
    options: options(
      ['pista', 'Pista'],
      ['all-mountain', 'All-mountain'],
      ['freestyle', 'Freestyle e park'],
      ['freeride', 'Freeride'],
      ['scialpinismo', 'Scialpinismo'],
    ),
  },
  livello: {
    key: 'livello',
    label: 'Livello tecnico',
    kind: 'enum',
    options: options(['principiante', 'Principiante'], ['intermedio', 'Intermedio'], ['avanzato', 'Avanzato'], ['esperto', 'Esperto']),
  },
  'lunghezza-snowboard': {
    key: 'lunghezza-snowboard',
    label: 'Lunghezza',
    kind: 'number',
    unit: 'cm',
    min: 110,
    max: 180,
    step: 1,
  },
  'profilo-tavola': {
    key: 'profilo-tavola',
    label: 'Profilo',
    kind: 'enum',
    options: options(['camber', 'Camber'], ['rocker', 'Rocker'], ['ibrido', 'Ibrido']),
  },
  'attacchi-inclusi': { key: 'attacchi-inclusi', label: 'Attacchi inclusi', kind: 'boolean' },
}

export function getAttribute(key: AttributeKey): AttributeDefinition {
  return ATTRIBUTES[key]
}

export function isAttributeKey(value: string): value is AttributeKey {
  return Object.hasOwn(ATTRIBUTES, value)
}

const numberFormat = new Intl.NumberFormat('it-IT', { maximumFractionDigits: 1 })

/** Valore leggibile per la scheda tecnica: "300 g", "M · 170–178 cm", "Sì". */
export function formatAttributeValue(definition: AttributeDefinition, value: string | number | boolean): string {
  switch (definition.kind) {
    case 'enum':
      return definition.options.find((option) => option.value === value)?.label ?? String(value)
    case 'number':
      return typeof value === 'number'
        ? `${numberFormat.format(value)}${definition.unit ? ` ${definition.unit}` : ''}`
        : String(value)
    case 'boolean':
      return value ? 'Sì' : 'No'
  }
}
