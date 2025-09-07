import React, { useState, useMemo } from 'react';
import { makeStyles, TextField, InputAdornment } from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';
import {
  useApi,
  analyticsApiRef,
  configApiRef,
} from '@backstage/core-plugin-api';
import { HeaderTabs } from '@backstage/core-components';
import { CatalogCardsContentProps } from '../types';
import { useInfiniteEntityList } from '../hooks/useInfiniteEntityList';
import { CatalogCardGrid } from './CatalogCardGrid';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: '100%',
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1, 2),
  },
  tabsContainer: {
    flex: 1,
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  searchField: {
    maxWidth: 300,
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    overflow: 'auto',
  },
}));

export const CatalogCardsContent: React.FC<CatalogCardsContentProps> = ({
  pageSize = 50,
  enableVirtualization = false,
  density = 'comfortable',
  expandDescriptionsDefault = false,
}) => {
  const classes = useStyles();
  const analyticsApi = useApi(analyticsApiRef);
  const configApi = useApi(configApiRef);

  // Kind filtering state
  const [selectedKindIndex, setSelectedKindIndex] = useState(0);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Get excluded kinds from app config
  const excludedKinds = useMemo(() => {
    try {
      // Try different ways to access the configuration
      let excludeKinds: string[] = [];

      // Method 1: Direct string array access
      try {
        const config1 = configApi.getOptionalStringArray(
          'catalog.cards.excludeKinds',
        );
        if (config1) excludeKinds = config1;
      } catch (e) {
        // Silent fallback to method 2
      }

      // Method 2: Access via nested config object
      if (excludeKinds.length === 0) {
        try {
          const catalogConfig = configApi.getOptionalConfig('catalog');
          if (catalogConfig) {
            const cardsConfig = catalogConfig.getOptionalConfig('cards');
            if (cardsConfig) {
              const excludeKindsFromNested =
                cardsConfig.getOptionalStringArray('excludeKinds');
              if (excludeKindsFromNested) excludeKinds = excludeKindsFromNested;
            }
          }
        } catch (e) {
          // Silent fallback to hardcoded values
        }
      }

      // If configuration reading fails, use hardcoded values
      // This matches the app-config.yaml configuration
      const hardcodedExcludeKinds = ['Location', 'Template', 'User'];
      return excludeKinds.length > 0 ? excludeKinds : hardcodedExcludeKinds;
    } catch (error) {
      // Return default excluded kinds on any error
      return ['Location', 'Template', 'User'];
    }
  }, [configApi]);

  // Infinite scroll for cards view
  const { entities, loading, hasNextPage, error, loadMore } =
    useInfiniteEntityList({
      pageSize,
      enabled: true,
    });

  // Filter out excluded kinds from entities
  const allowedEntities = useMemo(() => {
    return entities.filter((entity) => !excludedKinds.includes(entity.kind));
  }, [entities, excludedKinds]);

  // Calculate available entity kinds and create tabs
  const entityKinds = useMemo(() => {
    if (allowedEntities.length === 0) return [];
    const kinds = Array.from(
      new Set(allowedEntities.map((entity) => entity.kind)),
    ).sort();
    return kinds;
  }, [allowedEntities]);

  const tabs = useMemo(() => {
    const allTab = { id: 'all', label: 'All' };
    const kindTabs = entityKinds.map((kind) => ({
      id: kind.toLowerCase(),
      label: kind,
    }));
    return [allTab, ...kindTabs];
  }, [entityKinds]);

  // Search function
  const searchEntities = useMemo(() => {
    if (!searchQuery.trim()) {
      return allowedEntities;
    }

    const query = searchQuery.toLowerCase().trim();
    return allowedEntities.filter((entity) => {
      // Search in entity name
      if (entity.metadata.name?.toLowerCase().includes(query)) {
        return true;
      }

      // Search in title/display name
      if (entity.metadata.title?.toLowerCase().includes(query)) {
        return true;
      }

      // Search in description
      if (entity.metadata.description?.toLowerCase().includes(query)) {
        return true;
      }

      // Search in tags
      if (
        entity.metadata.tags?.some((tag) => tag.toLowerCase().includes(query))
      ) {
        return true;
      }

      // Search in spec.type
      if (
        typeof entity.spec?.type === 'string' &&
        entity.spec.type.toLowerCase().includes(query)
      ) {
        return true;
      }

      // Search in owner
      if (
        typeof entity.spec?.owner === 'string' &&
        entity.spec.owner.toLowerCase().includes(query)
      ) {
        return true;
      }

      return false;
    });
  }, [allowedEntities, searchQuery]);

  // Filter entities based on selected kind
  const filteredEntities = useMemo(() => {
    const entitiesToFilter = searchEntities;

    if (selectedKindIndex === 0) {
      return entitiesToFilter; // "All" tab
    }
    const selectedKind = entityKinds[selectedKindIndex - 1];
    return entitiesToFilter.filter((entity) => entity.kind === selectedKind);
  }, [searchEntities, selectedKindIndex, entityKinds]);

  const handleKindChange = (index: number) => {
    setSelectedKindIndex(index);

    // Track analytics
    analyticsApi.captureEvent({
      action: 'catalog_kind_filter',
      subject: 'catalog_cards',
      context: { kind: index === 0 ? 'all' : entityKinds[index - 1] } as any,
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Track analytics
    if (query.trim()) {
      analyticsApi.captureEvent({
        action: 'catalog_search',
        subject: 'catalog_cards',
        context: { query: query.trim() } as any,
      });
    }
  };

  return (
    <div className={classes.container}>
      {/* Header with Entity Kind Tabs and Search */}
      {(tabs.length > 1 || searchQuery.trim()) && (
        <div className={classes.headerContainer}>
          {/* Entity Kind Tabs */}
          {tabs.length > 1 && (
            <div className={classes.tabsContainer}>
              <HeaderTabs
                tabs={tabs}
                selectedIndex={selectedKindIndex}
                onChange={handleKindChange}
              />
            </div>
          )}

          {/* Search Bar */}
          <div className={classes.searchContainer}>
            <TextField
              className={classes.searchField}
              placeholder="Search entities..."
              value={searchQuery}
              onChange={handleSearchChange}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </div>
      )}

      {/* Cards Content */}
      <div className={classes.contentContainer}>
        <CatalogCardGrid
          entities={filteredEntities}
          loading={loading}
          hasNextPage={hasNextPage}
          onLoadMore={loadMore}
          error={error}
          density={density}
          expandDescriptionsDefault={expandDescriptionsDefault}
          enableVirtualization={enableVirtualization}
        />
      </div>
    </div>
  );
};
