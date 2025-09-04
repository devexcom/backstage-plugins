import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import {
  Grid,
  Box,
  CircularProgress,
  Typography,
  makeStyles,
  useTheme,
  useMediaQuery,
} from '@material-ui/core';
import { FixedSizeGrid as VirtualGrid } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { Alert } from '@material-ui/lab';
import { Entity } from '@backstage/catalog-model';
import { Progress, EmptyState } from '@backstage/core-components';
import { EntityCard } from './EntityCard';
import { CatalogCardGridProps } from '../types';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    height: '100%',
  },
  grid: {
    display: 'grid',
    gap: theme.spacing(2),
    padding: theme.spacing(1),
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
      gap: theme.spacing(1),
      padding: theme.spacing(1, 0.5),
    },
    [theme.breakpoints.up('lg')]: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    },
  },
  gridCompact: {
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
    },
    [theme.breakpoints.up('lg')]: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    },
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(4),
  },
  errorContainer: {
    margin: theme.spacing(2),
  },
  emptyContainer: {
    padding: theme.spacing(4),
    textAlign: 'center',
  },
  loadMoreSentinel: {
    height: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  virtualGrid: {
    '& [data-index]': {
      padding: theme.spacing(1),
    },
  },
  skeletonCard: {
    height: 300,
    backgroundColor: theme.palette.grey[100],
    borderRadius: theme.shape.borderRadius,
    animation: '$skeleton 1.5s ease-in-out infinite',
  },
  '@keyframes skeleton': {
    '0%': {
      opacity: 0.6,
    },
    '50%': {
      opacity: 0.3,
    },
    '100%': {
      opacity: 0.6,
    },
  },
}));

const CARD_HEIGHT = 320;
const CARD_HEIGHT_COMPACT = 280;

interface VirtualCardProps {
  index: number;
  style: React.CSSProperties;
  data: {
    entities: Entity[];
    columnsCount: number;
    density: 'compact' | 'comfortable';
    onCardClick?: (entity: Entity) => void;
    quickActions?: any[];
    hasNextPage: boolean;
    loadMore: () => void;
  };
}

const VirtualCard: React.FC<VirtualCardProps> = ({ index, style, data }) => {
  const {
    entities,
    columnsCount,
    density,
    onCardClick,
    quickActions,
    hasNextPage,
    loadMore,
  } = data;
  
  const entityIndex = index * columnsCount;
  const isLoadMoreIndex = entityIndex >= entities.length;
  
  // Trigger load more when approaching the end
  useEffect(() => {
    if (isLoadMoreIndex && hasNextPage && entities.length > 0) {
      loadMore();
    }
  }, [isLoadMoreIndex, hasNextPage, entities.length, loadMore]);
  
  if (isLoadMoreIndex) {
    return (
      <div style={style}>
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress size={24} />
        </Box>
      </div>
    );
  }
  
  return (
    <div style={style}>
      <Box display="flex" gap={2} height="100%">
        {Array.from({ length: columnsCount }, (_, colIndex) => {
          const entity = entities[entityIndex + colIndex];
          if (!entity) return <div key={colIndex} />;
          
          return (
            <Box key={entity.metadata.uid || `${entity.kind}-${entity.metadata.name}`} flex={1}>
              <EntityCard
                entity={entity}
                density={density}
                onClick={onCardClick}
                quickActions={quickActions}
              />
            </Box>
          );
        })}
      </Box>
    </div>
  );
};

export const CatalogCardGrid: React.FC<CatalogCardGridProps> = ({
  entities,
  loading,
  hasNextPage = false,
  onLoadMore,
  error,
  density = 'comfortable',
  expandDescriptionsDefault = false,
  quickActions = [],
  enableVirtualization = false,
  columns,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  // Calculate responsive columns
  const columnsCount = useMemo(() => {
    if (columns) return columns;
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  }, [columns, isMobile, isTablet]);
  
  // Intersection observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || !onLoadMore || !hasNextPage || loading) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [onLoadMore, hasNextPage, loading]);
  
  // Error state
  if (error) {
    return (
      <div className={classes.errorContainer}>
        <Alert severity="error">
          <Typography variant="h6">Failed to load catalog entities</Typography>
          <Typography variant="body2">{error.message}</Typography>
        </Alert>
      </div>
    );
  }
  
  // Empty state
  if (!loading && entities.length === 0) {
    return (
      <div className={classes.emptyContainer}>
        <EmptyState
          missing="content"
          title="No entities found"
          description="No entities match your current filters. Try adjusting your search criteria."
        />
      </div>
    );
  }
  
  // Virtualized grid for large datasets
  if (enableVirtualization && entities.length > 100) {
    const cardHeight = density === 'compact' ? CARD_HEIGHT_COMPACT : CARD_HEIGHT;
    const rowCount = Math.ceil((entities.length + (hasNextPage ? 1 : 0)) / columnsCount);
    
    const itemData = {
      entities,
      columnsCount,
      density,
      onCardClick: undefined,
      quickActions,
      hasNextPage,
      loadMore: onLoadMore || (() => {}),
    };
    
    return (
      <div className={classes.container}>
        <InfiniteLoader
          isItemLoaded={(index) => index < Math.ceil(entities.length / columnsCount)}
          itemCount={hasNextPage ? rowCount + 1 : rowCount}
          loadMoreItems={onLoadMore || (() => Promise.resolve())}
        >
          {({ onItemsRendered, ref }) => (
            <VirtualGrid
              ref={ref}
              className={classes.virtualGrid}
              height={600} // Fixed height for virtualization
              width="100%"
              columnCount={1}
              rowCount={rowCount}
              rowHeight={cardHeight + 32} // Add gap
              itemData={itemData}
              onItemsRendered={({ visibleRowStartIndex, visibleRowStopIndex }) =>
                onItemsRendered({
                  startIndex: visibleRowStartIndex,
                  stopIndex: visibleRowStopIndex,
                })
              }
            >
              {VirtualCard}
            </VirtualGrid>
          )}
        </InfiniteLoader>
      </div>
    );
  }
  
  // Regular grid with infinite scroll
  return (
    <div className={classes.container}>
      <div className={`${classes.grid} ${density === 'compact' ? classes.gridCompact : ''}`}>
        {entities.map((entity) => (
          <EntityCard
            key={entity.metadata.uid || `${entity.kind}-${entity.metadata.name}`}
            entity={entity}
            density={density}
            expandDescriptionDefault={expandDescriptionsDefault}
            quickActions={quickActions}
          />
        ))}
        
        {/* Loading skeletons */}
        {loading && (
          <>
            {Array.from({ length: Math.min(6, columnsCount * 2) }, (_, index) => (
              <div key={`skeleton-${index}`} className={classes.skeletonCard} />
            ))}
          </>
        )}
      </div>
      
      {/* Load more sentinel */}
      {hasNextPage && !loading && (
        <div ref={loadMoreRef} className={classes.loadMoreSentinel}>
          <CircularProgress size={24} />
          <Typography variant="body2" style={{ marginLeft: 8 }}>
            Loading more...
          </Typography>
        </div>
      )}
      
      {/* Loading indicator */}
      {loading && entities.length === 0 && (
        <div className={classes.loadingContainer}>
          <Progress />
        </div>
      )}
    </div>
  );
};