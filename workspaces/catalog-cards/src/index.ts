/**
 * Catalog Cards plugin for Backstage
 *
 * A drop-in frontend plugin that adds a rich card view to the catalog
 * with infinite scroll, view toggle, and enhanced entity display.
 *
 * @packageDocumentation
 */

export {
  catalogCardsPlugin,
  CatalogCardsContent,
  CatalogViewToggle,
  CatalogCardGrid,
  EntityCard,
} from './plugin';

export type {
  CatalogView,
  CatalogCardsContentProps,
  CatalogViewToggleProps,
  EntityCardProps,
  CatalogCardGridProps,
} from './types';

export { useCatalogViewState, useInfiniteEntityList } from './hooks';
