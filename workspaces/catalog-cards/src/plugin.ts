import { createPlugin } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const catalogCardsPlugin = createPlugin({
  id: 'catalog-cards',
  routes: {
    root: rootRouteRef,
  },
});

// Direct component exports - much simpler integration!
export { CatalogCardsContent } from './components/CatalogCardsContent';
export { CatalogViewToggle } from './components/CatalogViewToggle';
export { CatalogCardGrid } from './components/CatalogCardGrid';
export { EntityCard } from './components/EntityCard';
export { CatalogCardsPage } from './components/CatalogCardsPage';

// Route ref export for navigation setup
export { rootRouteRef as catalogCardsRouteRef } from './routes';
