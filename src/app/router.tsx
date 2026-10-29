import { createBrowserRouter } from 'react-router'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { AppLayout } from './AppLayout'
import { PageFallback } from './PageFallback'

/**
 * Le pagine diverse dalla home vengono scaricate solo quando servono (code splitting per rotta):
 * il primo caricamento su rete mobile resta leggero.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    Component: AppLayout,
    HydrateFallback: PageFallback,
    children: [
      { index: true, Component: HomePage },
      { path: 'cerca', lazy: () => import('@/pages/SearchPage').then((module) => ({ Component: module.SearchPage })) },
      {
        path: 'annuncio/:listingId',
        lazy: () => import('@/pages/ListingPage').then((module) => ({ Component: module.ListingPage })),
      },
      {
        path: 'negozio/:sellerId',
        lazy: () => import('@/pages/ShopPage').then((module) => ({ Component: module.ShopPage })),
      },
      {
        path: 'preferiti',
        lazy: () => import('@/pages/FavoritesPage').then((module) => ({ Component: module.FavoritesPage })),
      },
      { path: '*', Component: NotFoundPage },
    ],
  },
])
