import React, { useMemo, useRef, useEffect } from 'react';
import { Box, makeStyles, useTheme, useMediaQuery } from '@material-ui/core';
import { Entity } from '@backstage/catalog-model';
import { Progress, EmptyState, ErrorPanel } from '@backstage/core-components';
import { EntityCard } from './EntityCard';
import { VirtualizedGrid, EntityCardSkeleton } from './grid';
import { CatalogCardGridProps } from '../types';
import {
  CARD_DIMENSIONS,
  VIRTUALIZATION,
  GRID_SPACING,
  PAGINATION_DEFAULTS,
} from '../constants';

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100%',
  },
  grid: {
    display: 'grid',
    gap: theme.spacing(GRID_SPACING.GAP),
    padding: theme.spacing(GRID_SPACING.PADDING),
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gridAutoRows: 'minmax(280px, auto)', // Ensure consistent minimum height for all cards
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
      gap: theme.spacing(GRID_SPACING.GAP_COMPACT),
      padding: theme.spacing(
        GRID_SPACING.PADDING,
        GRID_SPACING.PADDING_COMPACT,
      ),
    },
    [theme.breakpoints.up('lg')]: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    },
    [theme.breakpoints.up('xl')]: {
      gridTemplateColumns: `repeat(auto-fill, minmax(${CARD_DIMENSIONS.MIN_WIDTH}px, 1fr))`,
    },
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
  },
  skeletonGrid: {
    display: 'grid',
    gap: theme.spacing(GRID_SPACING.GAP),
    padding: theme.spacing(GRID_SPACING.PADDING),
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  },
}));

export const CatalogCardGrid: React.FC<CatalogCardGridProps> = ({
  entities = [],
  loading = false,
  error,
  density = 'comfortable',
  enableVirtualization = true,
  hasNextPage = false,
  isLoadingMore = false,
  onLoadMore,
  onEntityClick,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const observerRef = useRef<IntersectionObserver>();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Calculate responsive columns
  const columnsCount = useMemo(() => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  }, [isMobile, isTablet]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (loading || !hasNextPage || !onLoadMore) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoadingMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [loading, hasNextPage, isLoadingMore, onLoadMore]);

  // Loading state
  if (loading && entities.length === 0) {
    return (
      <Box className={classes.skeletonGrid}>
        {Array.from({ length: 6 }, (_, index) => (
          <EntityCardSkeleton key={index} density={density} />
        ))}
      </Box>
    );
  }

  // Error state
  if (error) {
    return <ErrorPanel title="Failed to load entities" error={error} />;
  }

  // Empty state
  if (!loading && entities.length === 0) {
    return (
      <EmptyState
        missing="content"
        title="No entities found"
        description="No entities match the current filters"
      />
    );
  }

  // Use virtualization for large datasets
  if (enableVirtualization && entities.length > VIRTUALIZATION.THRESHOLD) {
    return (
      <VirtualizedGrid
        entities={entities}
        columnsCount={columnsCount}
        density={density}
        hasNextPage={hasNextPage}
        isLoadingMore={isLoadingMore}
        onLoadMore={onLoadMore || (() => {})}
        onEntityClick={onEntityClick}
      />
    );
  }

  // Regular grid for smaller datasets
  return (
    <Box className={classes.container}>
      <Box className={classes.grid}>
        {entities.map((entity) => (
          <EntityCard
            key={entity.metadata.uid}
            entity={entity}
            density={density}
            onClick={onEntityClick}
          />
        ))}
      </Box>

      {/* Load more trigger for infinite scroll */}
      {hasNextPage && (
        <div ref={loadMoreRef} className={classes.loadingContainer}>
          {isLoadingMore && <Progress />}
        </div>
      )}
    </Box>
  );
};
