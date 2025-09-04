import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { useApi, analyticsApiRef } from '@backstage/core-plugin-api';
import { CatalogTable, useEntityList } from '@backstage/plugin-catalog-react';
import { CatalogCardsContentProps } from '../types';
import { useCatalogViewState } from '../hooks/useCatalogViewState';
import { useInfiniteEntityList } from '../hooks/useInfiniteEntityList';
import { CatalogViewToggle } from './CatalogViewToggle';
import { CatalogCardGrid } from './CatalogCardGrid';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    height: '100%',
  },
  viewToggleContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: theme.spacing(1, 2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
  },
  contentContainer: {
    flex: 1,
    overflow: 'auto',
  },
  tableContainer: {
    '& .MuiTable-root': {
      minWidth: 0, // Allow table to shrink
    },
  },
}));

export const CatalogCardsContent: React.FC<CatalogCardsContentProps> = ({
  initialView = 'table',
  showViewToggle = true,
  tableComponent: CustomTable,
  pageSize = 50,
  enableVirtualization = false,
  density = 'comfortable',
  expandDescriptionsDefault = false,
}) => {
  const classes = useStyles();
  const analyticsApi = useApi(analyticsApiRef);
  
  // View state management
  const { view, setView } = useCatalogViewState(initialView);
  
  // Get entity list context for table view
  const { loading: tableLoading, error: tableError } = useEntityList();
  
  // Infinite scroll for cards view
  const {
    entities,
    loading: cardsLoading,
    hasNextPage,
    error: cardsError,
    loadMore,
    refresh,
  } = useInfiniteEntityList({
    pageSize,
    enabled: view === 'cards',
  });
  
  const handleViewChange = (newView: typeof view) => {
    setView(newView);
    
    // Track analytics
    analyticsApi.captureEvent('catalog_view_toggle', {
      from: view,
      to: newView,
      entitiesCount: entities.length,
    });
    
    // Refresh cards data when switching to cards view
    if (newView === 'cards' && entities.length === 0) {
      refresh();
    }
  };
  
  const TableComponent = CustomTable || CatalogTable;
  
  return (
    <div className={classes.container}>
      {/* View Toggle */}
      {showViewToggle && (
        <div className={classes.viewToggleContainer}>
          <CatalogViewToggle
            view={view}
            onViewChange={handleViewChange}
            disabled={tableLoading || cardsLoading}
          />
        </div>
      )}
      
      {/* Content */}
      <div className={classes.contentContainer}>
        {view === 'table' ? (
          <div className={classes.tableContainer}>
            <TableComponent />
          </div>
        ) : (
          <CatalogCardGrid
            entities={entities}
            loading={cardsLoading}
            hasNextPage={hasNextPage}
            onLoadMore={loadMore}
            error={cardsError}
            density={density}
            expandDescriptionsDefault={expandDescriptionsDefault}
            enableVirtualization={enableVirtualization}
          />
        )}
      </div>
    </div>
  );
};