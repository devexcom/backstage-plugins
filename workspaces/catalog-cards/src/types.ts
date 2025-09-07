/**
 * Type definitions for Catalog Cards plugin
 */

import { Entity } from '@backstage/catalog-model';

export type CatalogView = 'table' | 'cards';

export interface CatalogViewState {
  view: CatalogView;
  setView: (view: CatalogView) => void;
  toggleView: () => void;
}

export interface CatalogCardsContentProps {
  /** Items per page for infinite scroll */
  pageSize?: number;
  /** Whether to enable virtualization for large datasets */
  enableVirtualization?: boolean;
  /** Card density setting */
  density?: 'compact' | 'comfortable';
  /** Whether to show expanded descriptions by default */
  expandDescriptionsDefault?: boolean;
}

export interface CatalogViewToggleProps {
  /** Current view state */
  view: CatalogView;
  /** Callback when view changes */
  onViewChange: (view: CatalogView) => void;
  /** Whether the toggle is disabled */
  disabled?: boolean;
}

export interface EntityCardProps {
  /** The entity to display */
  entity: Entity;
  /** Card density setting */
  density?: 'compact' | 'comfortable';
  /** Whether to show expanded description by default */
  expandDescriptionDefault?: boolean;
  /** Callback when card is clicked */
  onClick?: (entity: Entity) => void;
  /** Custom quick actions */
  quickActions?: EntityQuickAction[];
}

export interface EntityQuickAction {
  /** Action identifier */
  id: string;
  /** Display label */
  label: string;
  /** Icon component */
  icon?: React.ComponentType;
  /** Action handler */
  onClick: (entity: Entity) => void;
  /** Whether action is visible for this entity */
  isVisible?: (entity: Entity) => boolean;
  /** Whether action is disabled */
  isDisabled?: (entity: Entity) => boolean;
}

export interface CatalogCardGridProps {
  /** List of entities to display */
  entities: Entity[];
  /** Whether data is loading */
  loading: boolean;
  /** Whether there are more items to load */
  hasNextPage?: boolean;
  /** Callback to load more items */
  onLoadMore?: () => void;
  /** Error state */
  error?: Error;
  /** Card density setting */
  density?: 'compact' | 'comfortable';
  /** Whether to show expanded descriptions by default */
  expandDescriptionsDefault?: boolean;
  /** Custom quick actions */
  quickActions?: EntityQuickAction[];
  /** Whether to enable virtualization */
  enableVirtualization?: boolean;
  /** Number of columns (responsive if not specified) */
  columns?: number;
}

export interface EntityMetadata {
  title: string;
  name: string;
  namespace: string;
  description?: string;
  tags: string[];
  owner?: string;
  type?: string;
  system?: string;
  lifecycle?: string;
  hasTechDocs: boolean;
  apiCount: number;
  isStarred: boolean;
  lastUpdated?: string;
  sourceUrl?: string;
}

export interface InfiniteEntityListState {
  entities: Entity[];
  loading: boolean;
  hasNextPage: boolean;
  error?: Error;
  loadMore: () => void;
  refresh: () => void;
}

export interface ViewPreferences {
  view: CatalogView;
  density: 'compact' | 'comfortable';
  expandDescriptions: boolean;
  sortBy?: string;
}

export type SortOption = {
  value: string;
  label: string;
  compareFn: (a: Entity, b: Entity) => number;
};
