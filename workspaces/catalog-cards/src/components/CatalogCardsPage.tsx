import React from 'react';
import { Page, Header, Content } from '@backstage/core-components';
import { EntityListProvider } from '@backstage/plugin-catalog-react';
import { CatalogCardsContent } from './CatalogCardsContent';

export const CatalogCardsPage = () => (
  <Page themeId="tool">
    <Header
      title="Catalog Cards"
      subtitle="Browse entities in a rich card view"
    />
    <Content>
      <EntityListProvider>
        <CatalogCardsContent
          pageSize={50}
          density="comfortable"
          enableVirtualization={false}
        />
      </EntityListProvider>
    </Content>
  </Page>
);
