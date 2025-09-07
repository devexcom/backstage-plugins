import { useState, useCallback, useEffect } from 'react';
import { useApi, storageApiRef } from '@backstage/core-plugin-api';
import { useLocation } from 'react-router-dom';
import { CatalogView, CatalogViewState } from '../types';

export function useCatalogViewState(
  initialView: CatalogView = 'table',
): CatalogViewState {
  const storageApi = useApi(storageApiRef);
  const location = useLocation();

  // Parse initial view from URL or storage
  const getInitialView = useCallback((): CatalogView => {
    const urlParams = new URLSearchParams(location.search);
    const urlView = urlParams.get('view') as CatalogView;

    if (urlView === 'table' || urlView === 'cards') {
      return urlView;
    }

    // Fallback to stored preference
    const storedView = storageApi.forBucket('catalog-cards').snapshot('view')
      .value as CatalogView;
    return storedView || initialView;
  }, [location.search, storageApi, initialView]);

  const [view, setViewState] = useState<CatalogView>(getInitialView);

  // Update URL and storage when view changes
  const setView = useCallback(
    (newView: CatalogView) => {
      setViewState(newView);

      // Store preference (URL updates disabled for now)
      storageApi.forBucket('catalog-cards').set('view', newView);
    },
    [storageApi],
  );

  const toggleView = useCallback(() => {
    setView(view === 'table' ? 'cards' : 'table');
  }, [view, setView]);

  // Sync with URL changes (back/forward navigation)
  useEffect(() => {
    const urlView = getInitialView();
    if (urlView !== view) {
      setViewState(urlView);
    }
  }, [getInitialView, view]);

  return {
    view,
    setView,
    toggleView,
  };
}
