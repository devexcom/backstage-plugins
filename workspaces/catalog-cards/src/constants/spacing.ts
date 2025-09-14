/**
 * Consistent spacing values based on Material-UI theme spacing
 * These replace hardcoded theme.spacing() calls with semantic constants
 */

/**
 * Card content spacing
 */
export const CARD_SPACING = {
  PADDING: 3, // theme.spacing(3) = 24px
  PADDING_BOTTOM: 3, // theme.spacing(3) = 24px
  MARGIN_BOTTOM: 2, // theme.spacing(2) = 16px
  MARGIN_RIGHT: 2, // theme.spacing(2) = 16px
} as const;

/**
 * Layout spacing for different component areas
 */
export const LAYOUT_SPACING = {
  HEADER: {
    MARGIN_BOTTOM: 2.5, // theme.spacing(2.5) = 20px
  },
  METADATA: {
    PADDING_TOP: 1, // theme.spacing(1) = 8px
    MARGIN_BOTTOM: 1, // theme.spacing(1) = 8px
  },
  TAGS: {
    GAP: 0.75, // theme.spacing(0.75) = 6px
    MARGIN_BOTTOM: 2.5, // theme.spacing(2.5) = 20px
  },
  OWNER_INFO: {
    GAP: 1.5, // theme.spacing(1.5) = 12px
    MARGIN_BOTTOM: 2, // theme.spacing(2) = 16px
  },
  ACTIONS: {
    GAP: 0.5, // theme.spacing(0.5) = 4px
    PADDING: 1.5, // theme.spacing(1.5) = 12px
    MARGIN_RIGHT: 1.5, // theme.spacing(1.5) = 12px
  },
} as const;

/**
 * Grid spacing
 */
export const GRID_SPACING = {
  GAP: 2, // theme.spacing(2) = 16px
  GAP_COMPACT: 1, // theme.spacing(1) = 8px
  PADDING: 1, // theme.spacing(1) = 8px
  PADDING_COMPACT: 0.5, // theme.spacing(0.5) = 4px
  CONTAINER_PADDING: 4, // theme.spacing(4) = 32px
} as const;

/**
 * Toggle component spacing
 */
export const TOGGLE_SPACING = {
  PADDING: [0.5, 1], // theme.spacing(0.5, 1) = 4px 8px
} as const;
