import React, { useState, useCallback } from 'react';
import {
  InputBase,
  IconButton,
  Paper,
  makeStyles,
  Chip,
  Box,
} from '@material-ui/core';
import { Search as SearchIcon, Clear as ClearIcon } from '@material-ui/icons';
import { useSearch } from '../hooks/useSearch';
import { useDebounce } from 'react-use';
import { SearchBarProps } from '../types';

const useStyles = makeStyles((theme) => ({
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    padding: '2px 4px',
    width: '100%',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    fontSize: '1.1rem',
  },
  iconButton: {
    padding: 10,
  },
  filtersContainer: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5),
  },
  filterChip: {
    height: 24,
    fontSize: '0.75rem',
  },
}));

export const SearchBar = ({
  placeholder = 'Search...',
  autoFocus = false,
}: SearchBarProps) => {
  const classes = useStyles();
  const { term, setTerm, filters, setFilters } = useSearch();
  const [localTerm, setLocalTerm] = useState(term);

  // Debounce search input
  useDebounce(
    () => {
      if (localTerm !== term) {
        setTerm(localTerm);
      }
    },
    300,
    [localTerm],
  );

  const handleClear = useCallback(() => {
    setLocalTerm('');
    setTerm('');
  }, [setTerm]);

  const handleFilterRemove = useCallback(
    (filterName: string, value?: string) => {
      const currentFilter = filters[filterName];
      if (!currentFilter) return;

      if (Array.isArray(currentFilter) && value) {
        const newValues = currentFilter.filter((v) => v !== value);
        setFilters({
          ...filters,
          [filterName]: newValues.length > 0 ? newValues : undefined,
        });
      } else {
        setFilters({
          ...filters,
          [filterName]: undefined,
        });
      }
    },
    [filters, setFilters],
  );

  const activeFilters = Object.entries(filters).filter(
    ([, value]) =>
      value !== undefined &&
      value !== '' &&
      (Array.isArray(value) ? value.length > 0 : true),
  );

  return (
    <Box>
      <Paper className={classes.searchBar} elevation={0} variant="outlined">
        <IconButton className={classes.iconButton} aria-label="search">
          <SearchIcon />
        </IconButton>

        <InputBase
          className={classes.input}
          placeholder={placeholder}
          value={localTerm}
          onChange={(e) => setLocalTerm(e.target.value)}
          autoFocus={autoFocus}
          inputProps={{ 'aria-label': 'search' }}
        />

        {localTerm && (
          <IconButton
            className={classes.iconButton}
            aria-label="clear search"
            onClick={handleClear}
          >
            <ClearIcon />
          </IconButton>
        )}
      </Paper>

      {activeFilters.length > 0 && (
        <Box className={classes.filtersContainer}>
          {activeFilters.map(([filterName, filterValue]) => {
            if (Array.isArray(filterValue)) {
              return filterValue.map((value) => (
                <Chip
                  key={`${filterName}-${value}`}
                  label={`${filterName}: ${value}`}
                  size="small"
                  variant="outlined"
                  className={classes.filterChip}
                  onDelete={() => handleFilterRemove(filterName, value)}
                />
              ));
            }
            return (
              <Chip
                key={filterName}
                label={`${filterName}: ${filterValue}`}
                size="small"
                variant="outlined"
                className={classes.filterChip}
                onDelete={() => handleFilterRemove(filterName)}
              />
            );
          })}
        </Box>
      )}
    </Box>
  );
};
