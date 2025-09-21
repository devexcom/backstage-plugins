import {
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';

export const searchOpensearchPlugin = createPlugin({
  id: 'search-opensearch',
  routes: {
    root: rootRouteRef,
  },
});

export const SearchPage = searchOpensearchPlugin.provide(
  createRoutableExtension({
    name: 'SearchPage',
    component: () =>
      import('./components/SearchPage').then((m) => m.SearchPage),
    mountPoint: rootRouteRef,
  }),
);
