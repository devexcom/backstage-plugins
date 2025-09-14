import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { FixedSizeGrid as VirtualGrid } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { Entity } from '@backstage/catalog-model';
import { EntityCard } from '../EntityCard';
import { CARD_DIMENSIONS, VIRTUALIZATION, GRID_LAYOUT } from '../../constants';

const useStyles = makeStyles(() => ({
  virtualGrid: {
    '& .virtual-grid-item': {
      display: 'flex',
      padding: '8px',
    },
  },
}));

interface VirtualCardData {
  entities: Entity[];
  columnsCount: number;
  density: 'comfortable' | 'compact';
  onEntityClick?: (entity: Entity) => void;
}

interface VirtualCardProps {
  index: number;
  style: React.CSSProperties;
  data: VirtualCardData;
}

const VirtualCard: React.FC<VirtualCardProps> = ({ index, style, data }) => {
  const { entities, columnsCount, density, onEntityClick } = data;
  const entityIndex = index * columnsCount;

  return (
    <div style={style}>
      <Box display="flex" style={{ gap: `${GRID_LAYOUT.GAP}px` }} height="100%">
        {Array.from({ length: columnsCount }, (_, colIndex) => {
          const entity = entities[entityIndex + colIndex];
          if (!entity) return <div key={colIndex} />;

          return (
            <div key={entity.metadata.uid} style={{ flex: 1 }}>
              <EntityCard
                entity={entity}
                density={density}
                onClick={onEntityClick}
              />
            </div>
          );
        })}
      </Box>
    </div>
  );
};

interface VirtualizedGridProps {
  entities: Entity[];
  columnsCount: number;
  density: 'comfortable' | 'compact';
  hasNextPage: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
  onEntityClick?: (entity: Entity) => void;
}

export const VirtualizedGrid: React.FC<VirtualizedGridProps> = ({
  entities,
  columnsCount,
  density,
  hasNextPage,
  isLoadingMore,
  onLoadMore,
  onEntityClick,
}) => {
  const classes = useStyles();

  const cardHeight =
    density === 'compact'
      ? CARD_DIMENSIONS.HEIGHT_COMPACT
      : CARD_DIMENSIONS.HEIGHT;

  const rowCount = Math.ceil(
    (entities.length + (hasNextPage ? 1 : 0)) / columnsCount,
  );

  const itemData: VirtualCardData = {
    entities,
    columnsCount,
    density,
    onEntityClick,
  };

  const isItemLoaded = (index: number) => {
    const entityIndex = index * columnsCount;
    return !!entities[entityIndex];
  };

  const loadMoreItems = isLoadingMore ? () => {} : onLoadMore;

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={hasNextPage ? rowCount + 1 : rowCount}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <VirtualGrid
          ref={ref}
          className={classes.virtualGrid}
          height={VIRTUALIZATION.CONTAINER_HEIGHT}
          width={VIRTUALIZATION.CONTAINER_WIDTH}
          columnCount={1}
          columnWidth={VIRTUALIZATION.CONTAINER_WIDTH}
          rowCount={rowCount}
          rowHeight={cardHeight + GRID_LAYOUT.GAP * 2}
          itemData={itemData}
          onItemsRendered={({ visibleRowStartIndex, visibleRowStopIndex }) => {
            onItemsRendered({
              visibleStartIndex: visibleRowStartIndex,
              visibleStopIndex: visibleRowStopIndex,
            });
          }}
        >
          {VirtualCard}
        </VirtualGrid>
      )}
    </InfiniteLoader>
  );
};
