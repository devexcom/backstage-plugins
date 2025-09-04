import { useState, useCallback, useEffect, useMemo } from 'react';
import { useApi, analyticsApiRef } from '@backstage/core-plugin-api';
import { catalogApiRef, useEntityList } from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';
import { InfiniteEntityListState } from '../types';

interface UseInfiniteEntityListOptions {
  pageSize?: number;
  enabled?: boolean;
}

export function useInfiniteEntityList(
  options: UseInfiniteEntityListOptions = {},
): InfiniteEntityListState {
  const { pageSize = 50, enabled = true } = options;

  const catalogApi = useApi(catalogApiRef);
  const analyticsApi = useApi(analyticsApiRef);

  // Get current filter state from EntityListProvider
  const { filters, queryParameters } = useEntityList();

  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [error, setError] = useState<Error>();
  const [offset, setOffset] = useState(0);

  // Create stable filter key for detecting changes
  const filterKey = useMemo(() => {
    return JSON.stringify({ filters, queryParameters });
  }, [filters, queryParameters]);

  const loadPage = useCallback(
    async (currentOffset: number, isRefresh: boolean = false) => {
      if (!enabled) return;

      setLoading(true);
      setError(undefined);

      try {
        // Only request minimal fields needed for card display
        const response = await catalogApi.getEntities({
          filter: filters as any,
          fields: [
            'kind',
            'metadata.namespace',
            'metadata.name',
            'metadata.title',
            'metadata.description',
            'metadata.tags',
            'metadata.annotations',
            'spec.owner',
            'spec.type',
            'spec.system',
            'spec.lifecycle',
            'relations',
          ],
          limit: pageSize,
          offset: currentOffset,
        });

        const newEntities = response.items;

        if (isRefresh || currentOffset === 0) {
          setEntities(newEntities);
        } else {
          setEntities((prev) => [...prev, ...newEntities]);
        }

        // Update pagination state
        setHasNextPage(newEntities.length === pageSize);
        setOffset(currentOffset + newEntities.length);

        // Track analytics
        analyticsApi.captureEvent('catalog_cards_load');
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to load entities');
        setError(error);

        analyticsApi.captureEvent('catalog_cards_error');
      } finally {
        setLoading(false);
      }
    },
    [enabled, catalogApi, filters, pageSize, analyticsApi],
  );

  const loadMore = useCallback(() => {
    if (!loading && hasNextPage) {
      loadPage(offset);
    }
  }, [loading, hasNextPage, offset, loadPage]);

  const refresh = useCallback(() => {
    setOffset(0);
    setHasNextPage(true);
    loadPage(0, true);
  }, [loadPage]);

  // Reset and reload when filters change
  useEffect(() => {
    setOffset(0);
    setHasNextPage(true);
    setEntities([]);
    loadPage(0, true);
  }, [filterKey, loadPage]);

  return {
    entities,
    loading,
    hasNextPage,
    error,
    loadMore,
    refresh,
  };
}
