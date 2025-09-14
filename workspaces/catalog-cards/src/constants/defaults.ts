/**
 * Pagination and data fetching defaults
 */
export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 50,
  INITIAL_PAGE: 0,
  MAX_RETRIES: 3,
} as const;

/**
 * Animation and transition defaults
 */
export const TRANSITIONS = {
  DURATION_SHORT: 150,
  DURATION_STANDARD: 300,
  EASING: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

/**
 * Component density modes
 */
export const DENSITY_MODES = {
  COMFORTABLE: 'comfortable',
  COMPACT: 'compact',
} as const;

/**
 * Default view state configuration
 */
export const VIEW_DEFAULTS = {
  DENSITY: DENSITY_MODES.COMFORTABLE,
  ENABLE_VIRTUALIZATION: true,
  ENABLE_INFINITE_SCROLL: true,
} as const;
