/**
 * Card dimensions and sizing constants
 */
export const CARD_DIMENSIONS = {
  HEIGHT: 320,
  HEIGHT_COMPACT: 280,
  MIN_WIDTH: 300,
  MIN_WIDTH_COMPACT: 250,
} as const;

/**
 * Grid layout constants
 */
export const GRID_LAYOUT = {
  GAP: 16,
  GAP_COMPACT: 8,
  PADDING: 16,
  PADDING_COMPACT: 8,
} as const;

/**
 * Virtualization constants
 */
export const VIRTUALIZATION = {
  CONTAINER_HEIGHT: 600,
  CONTAINER_WIDTH: 1200,
  OVERSCAN: 5,
  THRESHOLD: 50, // Start virtualization after this many items
} as const;

/**
 * Responsive breakpoints for grid columns
 */
export const GRID_BREAKPOINTS = {
  MOBILE: {
    COLUMNS: 1,
    MIN_WIDTH: 320,
  },
  TABLET: {
    COLUMNS: 2,
    MIN_WIDTH: 768,
  },
  DESKTOP: {
    COLUMNS: 3,
    MIN_WIDTH: 1024,
  },
  WIDE: {
    COLUMNS: 4,
    MIN_WIDTH: 1440,
  },
} as const;
