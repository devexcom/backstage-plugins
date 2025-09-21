import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Link,
  CircularProgress,
  makeStyles,
  Divider,
} from '@material-ui/core';
import {
  Description as DocIcon,
  Code as ComponentIcon,
  // Api as ApiIcon,
  AccountTree as SystemIcon,
} from '@material-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { useSearch } from '../hooks/useSearch';
import { SearchResultItem } from '../types';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  resultCard: {
    'transition': 'all 0.2s ease-in-out',
    '&:hover': {
      boxShadow: theme.shadows[4],
      transform: 'translateY(-1px)',
    },
  },
  resultHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  resultContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  highlight: {
    backgroundColor: theme.palette.type === 'dark' ? '#ff6f00' : '#fff3e0',
    fontWeight: 'bold',
    padding: '1px 2px',
    borderRadius: 2,
  },
  metadata: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5),
    marginTop: theme.spacing(1),
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  noResults: {
    textAlign: 'center',
    padding: theme.spacing(4),
    color: theme.palette.text.secondary,
  },
  statsContainer: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    backgroundColor: theme.palette.grey[50],
    borderRadius: theme.shape.borderRadius,
  },
}));

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'techdocs':
    case 'docs':
      return <DocIcon fontSize="small" />;
    case 'component':
      return <ComponentIcon fontSize="small" />;
    case 'api':
      return <DocIcon fontSize="small" />;
    case 'system':
      return <SystemIcon fontSize="small" />;
    default:
      return <DocIcon fontSize="small" />;
  }
};

const renderHighlightedText = (text: string, highlights?: string[]) => {
  if (!highlights || highlights.length === 0) {
    return text;
  }

  let highlightedText = text;
  highlights.forEach((_highlight) => {
    highlightedText = highlightedText.replace(
      /<mark>/g,
      '<span class="highlight">',
    );
    highlightedText = highlightedText.replace(/<\/mark>/g, '</span>');
  });

  return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
};

interface SearchResultCardProps {
  result: SearchResultItem;
}

const SearchResultCard = ({ result }: SearchResultCardProps) => {
  const classes = useStyles();
  const { document, type } = result;

  return (
    <Card className={classes.resultCard} elevation={1}>
      <CardContent className={classes.resultContent}>
        <Box className={classes.resultHeader}>
          {getTypeIcon(type)}
          <Link
            component={RouterLink}
            to={document.location}
            variant="h6"
            color="primary"
            underline="none"
          >
            {renderHighlightedText(document.title, result.highlight?.title)}
          </Link>
          <Chip size="small" label={type} variant="outlined" />
        </Box>

        <Typography variant="body2" color="textSecondary">
          {renderHighlightedText(
            document.text?.substring(0, 300) + '...' || '',
            result.highlight?.text,
          )}
        </Typography>

        <Box className={classes.metadata}>
          {document.owner && (
            <Chip
              size="small"
              label={`Owner: ${document.owner}`}
              variant="outlined"
            />
          )}
          {document.system && (
            <Chip
              size="small"
              label={`System: ${document.system}`}
              variant="outlined"
            />
          )}
          {document.lifecycle && (
            <Chip
              size="small"
              label={`Lifecycle: ${document.lifecycle}`}
              variant="outlined"
            />
          )}
          {document.tags && Array.isArray(document.tags) && (
            <>
              {document.tags.slice(0, 3).map((tag: string) => (
                <Chip
                  key={tag}
                  size="small"
                  label={tag}
                  variant="outlined"
                  color="secondary"
                />
              ))}
              {document.tags.length > 3 && (
                <Chip
                  size="small"
                  label={`+${document.tags.length - 3} more`}
                  variant="outlined"
                />
              )}
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export const SearchResults = () => {
  const classes = useStyles();
  const { loading, error, results } = useSearch();

  if (loading) {
    return (
      <Box className={classes.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className={classes.noResults}>
        <Typography variant="h6" color="error">
          Search Error
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {error.message || 'An error occurred while searching'}
        </Typography>
      </Box>
    );
  }

  if (!results || results.length === 0) {
    return (
      <Box className={classes.noResults}>
        <Typography variant="h6">No results found</Typography>
        <Typography variant="body2" color="textSecondary">
          Try adjusting your search terms or filters
        </Typography>
      </Box>
    );
  }

  return (
    <Box className={classes.container}>
      <Box className={classes.statsContainer}>
        <Typography variant="body2" color="textSecondary">
          Found {results.length} result{results.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      <Divider />

      {results.map((result: any, index: number) => (
        <SearchResultCard key={`${result.type}-${index}`} result={result} />
      ))}
    </Box>
  );
};
