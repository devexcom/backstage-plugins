import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { catalogCardsPlugin, CatalogCardsContent } from '../src/plugin';
import {
  EntityListProvider,
  CatalogApi,
  catalogApiRef,
  GetEntitiesRequest,
} from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';

// Mock catalog data for development
const mockEntities: Entity[] = Array.from({ length: 100 }, (_, i) => ({
  apiVersion: 'backstage.io/v1alpha1',
  kind: i % 3 === 0 ? 'Component' : i % 3 === 1 ? 'API' : 'Resource',
  metadata: {
    name: `entity-${i + 1}`,
    title: `Sample Entity ${i + 1}`,
    description: `This is a sample entity with a longer description to test the expand/collapse functionality. It contains multiple sentences to demonstrate how the truncation works in practice.`,
    tags: [`tag-${(i % 5) + 1}`, `category-${(i % 3) + 1}`],
    annotations: {
      'backstage.io/techdocs-ref': i % 4 === 0 ? 'dir:.' : '',
      'backstage.io/source-location': `https://github.com/example/repo-${i + 1}`,
    },
  },
  spec: {
    type: i % 3 === 0 ? 'service' : i % 3 === 1 ? 'openapi' : 'database',
    owner: `team-${(i % 4) + 1}`,
    system: `system-${(i % 3) + 1}`,
    lifecycle: ['experimental', 'production', 'deprecated'][i % 3],
  },
  relations: [
    {
      type: 'apiProvidedBy',
      targetRef: `api:default/api-${i + 1}`,
      target: {
        kind: 'api',
        namespace: 'default',
        name: `api-${i + 1}`,
      },
    },
  ],
}));

// Mock catalog API
const mockCatalogApi: Partial<CatalogApi> = {
  getEntities: async (request?: GetEntitiesRequest) => {
    const { limit = 20, offset = 0 } = request || {};
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const start = offset || 0;
    const end = start + limit;
    const items = mockEntities.slice(start, end);

    return {
      items,
      totalItems: mockEntities.length,
      request: { limit, offset },
    };
  },
  getEntityByRef: async (entityRef) => {
    const entity = mockEntities.find(
      (e) =>
        `${e.kind}:${e.metadata.namespace || 'default'}/${e.metadata.name}` ===
        entityRef,
    );
    return entity || undefined;
  },
};

createDevApp()
  .registerPlugin(catalogCardsPlugin)
  .registerApi({
    api: catalogApiRef,
    deps: {},
    factory: () => mockCatalogApi as CatalogApi,
  })
  .addPage({
    element: (
      <EntityListProvider>
        <div style={{ height: '100vh', padding: '1rem' }}>
          <h1>Catalog Cards Demo</h1>
          <CatalogCardsContent
            initialView="cards"
            showViewToggle={true}
            pageSize={20}
            density="comfortable"
            enableVirtualization={false}
          />
        </div>
      </EntityListProvider>
    ),
    title: 'Cards View Demo',
    path: '/cards',
  })
  .addPage({
    element: (
      <EntityListProvider>
        <div style={{ height: '100vh', padding: '1rem' }}>
          <h1>Catalog Cards - Virtualized</h1>
          <CatalogCardsContent
            initialView="cards"
            showViewToggle={true}
            pageSize={50}
            density="compact"
            enableVirtualization={true}
          />
        </div>
      </EntityListProvider>
    ),
    title: 'Virtualized Demo',
    path: '/virtualized',
  })
  .render();
