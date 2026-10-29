# SpeedySport24 — Prototipo MVP

**Tutto lo sport. Un solo posto.** Il marketplace verticale dell'attrezzatura sportiva: nuovo, fine serie e usato,
da negozi e privati, con la precisione di ricerca di un portale come Immobiliare.it.

## Avvio

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check (tsc -b) + build di produzione in dist/
npm run lint       # oxlint
```

Richiede Node.js 20.19+ o 22.12+. Il deploy è su Vercel: ogni push su `main` pubblica il sito
(`vercel.json` reindirizza tutte le rotte a `index.html`, così i link diretti agli annunci funzionano).

## Cosa c'è nel prototipo

| Pagina | Rotta | Contenuto |
| --- | --- | --- |
| Home | `/` | Ricerca centrale, sport per immagini, nuovo e fine serie dai negozi, appena pubblicati, vicino a te, negozi vs privati, Secondo Tempo |
| Ricerca | `/cerca?…` | Filtri generali + filtri tecnici per sottocategoria, conteggi per opzione, chip rimovibili, suggerimenti a zero risultati |
| Annuncio | `/annuncio/:id` | Galleria, scheda tecnica omogenea, condizioni e difetti, consegna/pagamento/garanzie, fascia di prezzo comparabile, condividi, segnala |
| Negozio | `/negozio/:id` | Vetrina professionale: contatti, orari, condizioni di vendita, prodotti filtrabili per tipologia |
| Preferiti | `/preferiti` | Annunci salvati sul dispositivo, senza account |

Volutamente **non** attivi (e dichiarati come tali nell'interfaccia): account, pubblicazione con assistente IA,
messaggistica reale, pagamenti, badge "24H". Nessun prezzo barrato o sconto non verificabile.

## Stack

| Ambito | Scelta | Perché |
| --- | --- | --- |
| Build | Vite 8 + React 19 | Dev server istantaneo, build veloci |
| Rotte | React Router 7 (data router, pagine caricate on demand) | URL condivisibili, code splitting, strada aperta a SSR |
| Linguaggio | TypeScript (strict, `noUncheckedIndexedAccess`) | Contratti dati espliciti, refactoring sicuro |
| Stile | Tailwind CSS v4 (config CSS-first in `src/index.css`) | Token del brand in un unico posto |
| Icone | lucide-react (+ 2 icone custom: tennis, basket) | Stile coerente, tree-shaking |
| UI accessibile | Headless UI (Dialog, Switch) | Focus trap, Esc, scroll lock, ARIA |
| Animazioni | Motion (`motion/react`) | Micro-interazioni, rispetta "Riduci movimento" |
| Font | Inter + Saira (self-hosted via Fontsource) | Nessuna chiamata a Google Fonts (GDPR) |

## Modello dati

- **Tassonomia** (`src/config/taxonomy.ts`): sport → sottocategorie (con macro-categoria trasversale),
  tipologie d'offerta (`nuovo`, `fine-serie`, `mai-usato`, `usato`) raggruppate in tre famiglie, condizioni dell'usato.
- **Attributi tecnici** (`src/config/attributes.ts`): definiti una volta (tipo, opzioni, unità) e assegnati alle
  sottocategorie. Guidano scheda tecnica, filtri e validazione; diventeranno la tabella `attribute_definitions`
  e lo schema del form di pubblicazione / dell'assistente IA.
- **Venditori** (`Seller = PrivateSeller | ShopSeller`): il negozio ha profilo professionale, P.IVA, orari e
  condizioni di vendita. Il badge di verifica compare solo se `verifiedAt` è valorizzato.
- **Annuncio**: marca, modello, attributi strutturati, difetti dichiarati, consegna (spedizione con costo /
  ritiro), stato (`disponibile` · `riservato` · `venduto`), quantità. Prezzi in centesimi, date ISO.
- Il repository mock valida in sviluppo che gli attributi appartengano alla sottocategoria.

Nomi, negozi, indirizzi e partite IVA nei dati dimostrativi sono di fantasia; le foto sono di Unsplash e non
rappresentano gli oggetti in vendita (negli annunci reali dovranno esserlo).

## Struttura

```
src/
├── app/                   Router, layout, percorsi, messaggi "in arrivo"
├── pages/                 Home, Ricerca, Annuncio, Negozio, Preferiti, 404
├── components/            layout/ (Header, Footer) · ui/ (Button, Badge, Logo, Breadcrumbs, Toast…)
├── features/
│   ├── home/components/   Hero, sport, vicino a te, negozi vs privati, Secondo Tempo, vendi
│   ├── search/components/ Pannello filtri, barra tipologia/venditore, toolbar, zero risultati, filtri mobile
│   └── listings/
│       ├── api/           listingsRepository → unico punto di accesso ai dati
│       ├── components/    Card, griglia, carosello, galleria, scheda annuncio, venditore, contatto
│       ├── hooks/         useListings, useListingFilters (URL), useFilteredListings, useFavorites, usePreferredPlace
│       └── lib/           filterListings (filtri, conteggi, suggerimenti), filtersUrl, priceInsight
├── config/                taxonomy, attributes, places (gazetteer + distanze)
├── mocks/                 Dati dimostrativi in forma "riga di database"
├── types/                 Modello di dominio condiviso
└── lib/                   format, images, search (tollerante ai refusi), store, geolocation, hooks
```

Principi:

- **L'URL è l'unica fonte di verità della ricerca**: `/cerca?sottocategoria=biciclette&taglia-telaio=m&prezzo-max=1500`
  è condivisibile, sopravvive al refresh e funziona con avanti/indietro.
- **Logica separata dalla UI**: filtri, conteggi e fascia di prezzo sono funzioni pure in `features/listings/lib`.
- **Niente promesse non mantenute**: ciò che non esiste ancora è etichettato "in arrivo" o spiegato come demo.

## Integrazione backend (Supabase consigliato)

La UI dipende solo dall'interfaccia `ListingsRepository`. Per passare ai dati reali:

1. Tabelle: `sports`, `subcategories`, `attribute_definitions`, `listings` (attributi in `jsonb`, indicizzati
   con GIN), `profiles` + `shops`, `favorites`, `saved_searches`, `reports`. Località con PostGIS per il raggio.
2. Implementare `createSupabaseListingsRepository(supabase)` e sostituire l'export `listingsRepository`.
3. Con cataloghi grandi filtri e conteggi passano lato server: `ListingFilters` è già serializzabile e diventa
   il payload della query; la ricerca tollerante ai refusi si sposta su `pg_trgm` o un motore dedicato.

Per l'indicizzazione delle pagine annuncio serve il rendering lato server (React Router in modalità framework
o Next.js): le rotte e i componenti attuali sono già organizzati per quel passaggio.

## Accessibilità

- Navigazione completa da tastiera, focus visibile, skip link, scorciatoia `/` per la ricerca.
- Filtri con veri radio/checkbox, conteggi annunciati, chip rimovibili con etichetta esplicita.
- Card con pattern "stretched link"; galleria con frecce ← →, swipe e annunci `aria-live`.
- Animazioni disattivate se il sistema operativo richiede "Riduci movimento".
