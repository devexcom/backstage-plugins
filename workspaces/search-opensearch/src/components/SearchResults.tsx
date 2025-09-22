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
    const errorMessage = result.error.message || 'Unknown error occurred';
    const errorName = (result.error as any).name || 'Error';

    // Enhanced error display based on error type
    const getErrorDisplay = () => {
      if (errorMessage.includes('OpenSearch service is not available')) {
        return {
          title: 'Search Service Unavailable',
          message: 'The search service is currently offline.',
          suggestion: 'Please contact your administrator or try again later.',
          icon: '🔌',
        };
      }

      if (errorMessage.includes('hostname could not be resolved')) {
        return {
          title: 'Configuration Error',
          message: 'Search service configuration issue.',
          suggestion: 'Please contact your administrator.',
          icon: '⚙️',
        };
      }

      if (errorMessage.includes('authentication failed')) {
        return {
          title: 'Authentication Error',
          message: 'Search service authentication failed.',
          suggestion: 'Please contact your administrator.',
          icon: '🔐',
        };
      }

      if (errorMessage.includes('timed out')) {
        return {
          title: 'Search Timeout',
          message: 'The search took too long to complete.',
          suggestion: 'Try simplifying your search terms or try again.',
          icon: '⏱️',
        };
      }

      return {
        title: 'Search Error',
        message: errorMessage,
        suggestion:
          'Please try again or contact support if the problem persists.',
        icon: '❌',
      };
    };

    const errorDisplay = getErrorDisplay();

    return (
      <Box className={classes.noResults}>
        <Typography variant="h6" color="error" gutterBottom>
          {errorDisplay.icon} {errorDisplay.title}
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          {errorDisplay.message}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {errorDisplay.suggestion}
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
