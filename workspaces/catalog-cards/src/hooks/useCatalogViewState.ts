import { useState, useCallback, useEffect } from 'react';
import { useApi, storageApiRef } from '@backstage/core-plugin-api';
import { useLocation, useNavigate } from 'react-router-dom';
import { CatalogView, CatalogViewState } from '../types';

const STORAGE_KEY = 'catalog-cards:view-preference';

export function useCatalogViewState(
  initialView: CatalogView = 'table',
): CatalogViewState {
  const storageApi = useApi(storageApiRef);
  const location = useLocation();
  const navigate = useNavigate();

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

      // Update URL parameter
      const searchParams = new URLSearchParams(location.search);
      if (newView === 'table') {
        searchParams.delete('view'); // Default view, don't clutter URL
      } else {
        searchParams.set('view', newView);
      }

      const newSearch = searchParams.toString();
      const newPath = `${location.pathname}${newSearch ? `?${newSearch}` : ''}`;

      // Use replace to avoid cluttering browser history
      navigate(newPath, { replace: true });

      // Store preference
      storageApi.forBucket('catalog-cards').set('view', newView);
    },
    [location.pathname, location.search, navigate, storageApi],
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
  }, [location.search, getInitialView, view]);

  return {
    view,
    setView,
    toggleView,
  };
}
