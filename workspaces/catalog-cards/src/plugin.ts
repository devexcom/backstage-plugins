import {
  createPlugin,
  createComponentExtension,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const catalogCardsPlugin = createPlugin({
  id: 'catalog-cards',
  routes: {
    root: rootRouteRef,
  },
});

export const CatalogCardsContent = catalogCardsPlugin.provide(
  createComponentExtension({
    name: 'CatalogCardsContent',
    component: {
      lazy: () =>
        import('./components/CatalogCardsContent').then(
          (m) => m.CatalogCardsContent as any,
        ),
    },
  }),
);

export const CatalogViewToggle = catalogCardsPlugin.provide(
  createComponentExtension({
    name: 'CatalogViewToggle',
    component: {
      lazy: () =>
        import('./components/CatalogViewToggle').then(
          (m) => m.CatalogViewToggle as any,
        ),
    },
  }),
);

export const CatalogCardGrid = catalogCardsPlugin.provide(
  createComponentExtension({
    name: 'CatalogCardGrid',
    component: {
      lazy: () =>
        import('./components/CatalogCardGrid').then(
          (m) => m.CatalogCardGrid as any,
        ),
    },
  }),
);
