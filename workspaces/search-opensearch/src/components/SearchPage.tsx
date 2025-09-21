import React from 'react';
import { Grid, Paper } from '@material-ui/core';
import { Page, Header, Content } from '@backstage/core-components';
import {
  SearchContextProvider,
  SearchBar,
  SearchResult,
} from '@backstage/plugin-search-react';
import { SearchFilters } from './SearchFilters';
import { SearchPageProps } from '../types';

export const SearchPage = ({
  title = 'Search',
  subtitle = 'Search across all Backstage resources',
}: SearchPageProps) => {
  return (
    <SearchContextProvider>
      <Page themeId="tool">
        <Header title={title} subtitle={subtitle} />
        <Content>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper elevation={1} style={{ padding: '16px' }}>
                <SearchBar placeholder="Search documentation, components, APIs..." />
              </Paper>
            </Grid>

            <Grid item xs={12} md={3}>
              <SearchFilters />
            </Grid>

            <Grid item xs={12} md={9}>
              <SearchResult />
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>
  );
};
