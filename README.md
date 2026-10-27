# Speedy Sport 24 — Prototipo vetrina MVP

Marketplace C2C di articoli sportivi usati: l'immediatezza di Vinted con la struttura per categorie di Immobiliare.it.

## Avvio

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check (tsc -b) + build di produzione in dist/
npm run lint       # oxlint
```

Richiede Node.js 20.19+ o 22.12+.

## Stack

| Ambito | Scelta | Perché |
| --- | --- | --- |
| Build | Vite 8 + React 19 | Dev server istantaneo, build veloci |
| Linguaggio | TypeScript (strict, `noUncheckedIndexedAccess`) | Contratti dati espliciti, refactoring sicuro |
| Stile | Tailwind CSS v4 (config CSS-first in `src/index.css`) | Token del brand in un unico posto |
| Icone | lucide-react (+ 2 icone custom: tennis, basket) | Stile coerente, tree-shaking |
| UI accessibile | Headless UI (Dialog, Switch) | Focus trap, Esc, scroll lock, ARIA |
| Animazioni | Motion (`motion/react`) | Micro-interazioni, rispetta "Riduci movimento" |
| Utility | clsx + tailwind-merge (`cn()`) | Classi condizionali senza conflitti |
| Font | Inter + Saira (self-hosted via Fontsource) | Nessuna chiamata a Google Fonts (GDPR) |

## Palette del brand

Estratta dal logo e definita come token in `src/index.css` (`@theme`):

| Token | Valore | Uso |
| --- | --- | --- |
| `brand-600` | `#0064C8` | Primary: link, bottoni primari, focus |
| `brand-700` | `#0047AB` | Primary dark: hover, wordmark |
| `brand-950` | `#0A1F47` | Hero, footer, testi su giallo |
| `accent-500` | `#FFB800` | CTA ("+ Vendi Usato", "Contatta Venditore"), badge 24h |
| `surface` | `#F8FAFC` | Sfondo pagina |

Ogni colore ha la scala completa 50–950 (`bg-brand-50`, `text-accent-700`, …).
Il giallo si usa come **sfondo** con testo `brand-950` (contrasto AA); mai come colore del testo su bianco.

## Struttura

```
src/
├── components/
│   ├── layout/            Header, Footer
│   └── ui/                Atomi riutilizzabili: Button, Badge, Logo, SportIcon, Toast
├── features/
│   ├── home/components/   Hero (ricerca a 3 filtri), carosello sport, banner "Vendi"
│   └── listings/
│       ├── api/           listingsRepository → unico punto di accesso ai dati
│       ├── components/    Card, griglia, toolbar filtri, modale dettaglio, galleria, venditore
│       ├── hooks/         useListings, useListingFilters, useFilteredListings, useFavorites
│       └── lib/           filterListings (logica pura: filtro, ordinamento, conteggi)
├── config/taxonomy.ts     Sport, categorie, stati d'usura
├── mocks/                 Dati finti in forma "riga di database" (listings, sellers)
├── types/                 Modello di dominio condiviso
├── lib/                   cn, format (Intl it-IT), images (CDN), text, dom
└── pages/HomePage.tsx     Composizione della pagina e stato condiviso
```

Principi:

- **Logica separata dalla UI**: i componenti ricevono dati e callback; stato e regole vivono negli hook e in `lib/`.
- **Un'unica fonte di verità per i filtri**: header, hero, carosello e toolbar modificano lo stesso stato,
  sincronizzato con la query string (`/?sport=calcio&luogo=milano&spedizione24h=1` è condivisibile).
- **Prezzi in centesimi** (interi) e date ISO 8601: pronti per Postgres/Firestore.

## Integrazione backend (Supabase / Firebase)

La UI dipende solo dall'interfaccia `ListingsRepository` (`src/features/listings/api/listingsRepository.ts`).
Per passare ai dati reali:

1. Creare le tabelle partendo dai tipi: `ListingRecord` → `listings` (con `seller_id`), `Seller` → `profiles`,
   tassonomia → `sports` / `categories` (o enum).
2. Implementare il repository, ad esempio:

   ```ts
   export function createSupabaseListingsRepository(supabase: SupabaseClient): ListingsRepository {
     return {
       async list({ signal } = {}) {
         const { data, error } = await supabase
           .from('listings')
           .select('*, seller:profiles(*)')
           .abortSignal(signal!)
         if (error) throw error
         return data.map(mapRowToListing) // snake_case → camelCase
       },
       // getById …
     }
   }
   ```

3. Sostituire l'export `listingsRepository`. Hook e componenti restano invariati.

Con cataloghi grandi, il filtro si sposta lato server: `ListingFilters` è già serializzabile e diventa
il payload della query (es. `.ilike('title', …)`, `.eq('sport_id', …)`, paginazione con `.range()`).
A quel punto conviene introdurre TanStack Query per cache e revalidazione.

## Accessibilità

- Navigazione completa da tastiera, focus visibile, skip link "Vai agli annunci", scorciatoia `/` per la ricerca.
- Card con pattern "stretched link" (nessun elemento interattivo annidato).
- Modale con focus trap, chiusura con `Esc` e ritorno del focus alla card; galleria con frecce ← →, swipe e annunci `aria-live`.
- Animazioni disattivate se il sistema operativo richiede "Riduci movimento".

## Note sul prototipo

- I dati sono dimostrativi; le foto provengono da Unsplash.
- "Accedi", "Vendi Usato" e l'invio del messaggio al venditore sono simulati (toast / stato di conferma).
- I preferiti sono salvati in `localStorage`.
