import React, { useCallback } from 'react';
import { SearchBar as BackstageSearchBar } from '@backstage/plugin-search-react';
import { Chip, Box, makeStyles } from '@material-ui/core';
import { useSearch } from '../hooks/useSearch';
import { SearchBarProps } from '../types';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  filtersContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
}));

export const SearchBar = ({ placeholder = 'Search...' }: SearchBarProps) => {
  const classes = useStyles();
  const { filters, setFilters } = useSearch();

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
    <Box className={classes.container}>
      <BackstageSearchBar placeholder={placeholder} />

      {activeFilters.length > 0 && (
        <Box className={classes.filtersContainer}>
          {activeFilters.map(([filterName, values]) => {
            if (Array.isArray(values)) {
              return values.map((value) => (
                <Chip
                  key={`${filterName}-${value}`}
                  label={`${filterName}: ${value}`}
                  size="small"
                  variant="outlined"
                  onDelete={() => handleFilterRemove(filterName, value)}
                />
              ));
            } else {
              return (
                <Chip
                  key={filterName}
                  label={`${filterName}: ${values}`}
                  size="small"
                  variant="outlined"
                  onDelete={() => handleFilterRemove(filterName)}
                />
              );
            }
          })}
        </Box>
      )}
    </Box>
  );
};
