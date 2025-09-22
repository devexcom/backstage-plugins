import React from 'react';
import {
  useSearch,
  DefaultResultListItem,
} from '@backstage/plugin-search-react';
import { Box, Typography, makeStyles } from '@material-ui/core';
import { Progress } from '@backstage/core-components';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  noResults: {
    textAlign: 'center',
    padding: theme.spacing(4),
    color: theme.palette.text.secondary,
  },
  resultsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
}));

export const SearchResults = () => {
  const classes = useStyles();
  const { result } = useSearch();

  if (result.loading) {
    return <Progress />;
  }

  if (result.error) {
    return (
      <Box className={classes.noResults}>
        <Typography color="error">
          Error loading search results: {result.error.message}
        </Typography>
      </Box>
    );
  }

  if (!result.value) {
    return (
      <Box className={classes.noResults}>
        <Typography variant="h6">No results found</Typography>
        <Typography>Try adjusting your search terms or filters</Typography>
      </Box>
    );
  }

  const results = result.value.results || [];
  if (results.length === 0) {
    return (
      <Box className={classes.noResults}>
        <Typography variant="h6">No results found</Typography>
        <Typography>Try adjusting your search terms or filters</Typography>
      </Box>
    );
  }

  return (
    <Box className={classes.container}>
      <Box className={classes.resultsHeader}>
        <Typography variant="h6">
          Found {results.length} result{results.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {results.map((searchResult: any, index: number) => (
        <DefaultResultListItem
          key={`${searchResult.type}-${searchResult.document?.location || index}`}
          result={searchResult}
          highlight={searchResult.highlight}
          rank={index + 1}
        />
      ))}
    </Box>
  );
};
