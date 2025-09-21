import React from 'react';
import {
  SearchResult,
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

  return (
    <Box className={classes.container}>
      <SearchResult>
        {({ loading, error, value }) => {
          if (loading) {
            return <Progress />;
          }

          if (error) {
            return (
              <Box className={classes.noResults}>
                <Typography color="error">
                  Error loading search results: {error.message}
                </Typography>
              </Box>
            );
          }

          if (!value || value.length === 0) {
            return (
              <Box className={classes.noResults}>
                <Typography variant="h6">No results found</Typography>
                <Typography>
                  Try adjusting your search terms or filters
                </Typography>
              </Box>
            );
          }

          return (
            <>
              <Box className={classes.resultsHeader}>
                <Typography variant="h6">
                  Found {value.length} result{value.length !== 1 ? 's' : ''}
                </Typography>
              </Box>

              {value.map((result, index) => (
                <DefaultResultListItem
                  key={`${result.type}-${result.document?.location || index}`}
                  result={result}
                  highlight={result.highlight}
                  rank={index + 1}
                />
              ))}
            </>
          );
        }}
      </SearchResult>
    </Box>
  );
};
