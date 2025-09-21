import React, { useState } from 'react';
import { InfoCard } from '@backstage/core-components';
import { useSearch } from '@backstage/plugin-search-react';
import {
  Box,
  Typography,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  makeStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  filterSection: {
    width: '100%',
  },
  filterContent: {
    padding: 0,
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
  },
  facetItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  facetCount: {
    backgroundColor: theme.palette.grey[200],
    color: theme.palette.text.secondary,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.7rem',
    fontWeight: 'bold',
  },
  searchField: {
    width: '100%',
    marginBottom: theme.spacing(1),
  },
}));

const DOCUMENT_TYPES = [
  { value: 'techdocs', label: 'Documentation', count: 0 },
  { value: 'component', label: 'Components', count: 0 },
  { value: 'api', label: 'APIs', count: 0 },
  { value: 'system', label: 'Systems', count: 0 },
  { value: 'resource', label: 'Resources', count: 0 },
];

const LIFECYCLE_STAGES = [
  { value: 'production', label: 'Production', count: 0 },
  { value: 'development', label: 'Development', count: 0 },
  { value: 'experimental', label: 'Experimental', count: 0 },
  { value: 'deprecated', label: 'Deprecated', count: 0 },
];

export const SearchFilters = () => {
  const classes = useStyles();
  const { filters, setFilters } = useSearch();
  const [ownerFilter, setOwnerFilter] = useState('');

  const handleTypeChange = (type: string, checked: boolean) => {
    const currentTypes = (filters.type as string[]) || [];
    const newTypes = checked
      ? [...currentTypes, type]
      : currentTypes.filter((t) => t !== type);

    setFilters({
      ...filters,
      type: newTypes.length > 0 ? newTypes : undefined,
    });
  };

  const handleLifecycleChange = (lifecycle: string, checked: boolean) => {
    const currentLifecycles = (filters.lifecycle as string[]) || [];
    const newLifecycles = checked
      ? [...currentLifecycles, lifecycle]
      : currentLifecycles.filter((l) => l !== lifecycle);

    setFilters({
      ...filters,
      lifecycle: newLifecycles.length > 0 ? newLifecycles : undefined,
    });
  };

  const handleOwnerFilter = (owner: string) => {
    setFilters({
      ...filters,
      owner: owner.trim() || undefined,
    });
  };

  const clearAllFilters = () => {
    setFilters({});
    setOwnerFilter('');
  };

  const activeFilterCount = Object.values(filters).filter(
    (value) =>
      value !== undefined &&
      value !== '' &&
      (Array.isArray(value) ? value.length > 0 : true),
  ).length;

  return (
    <Box className={classes.container}>
      <InfoCard
        title="Filters"
        action={
          activeFilterCount > 0 ? (
            <Chip
              size="small"
              label={`${activeFilterCount} active`}
              variant="outlined"
              onDelete={clearAllFilters}
            />
          ) : undefined
        }
      >
        <Accordion className={classes.filterSection} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2">Content Type</Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.filterContent}>
            <FormControl component="fieldset" className={classes.filterGroup}>
              <FormGroup>
                {DOCUMENT_TYPES.map((type) => (
                  <FormControlLabel
                    key={type.value}
                    control={
                      <Checkbox
                        checked={((filters.type as string[]) || []).includes(
                          type.value,
                        )}
                        onChange={(e) =>
                          handleTypeChange(type.value, e.target.checked)
                        }
                        size="small"
                      />
                    }
                    label={
                      <Box className={classes.facetItem}>
                        <span>{type.label}</span>
                        {type.count > 0 && (
                          <Box className={classes.facetCount}>{type.count}</Box>
                        )}
                      </Box>
                    }
                  />
                ))}
              </FormGroup>
            </FormControl>
          </AccordionDetails>
        </Accordion>

        <Accordion className={classes.filterSection}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2">Lifecycle</Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.filterContent}>
            <FormControl component="fieldset" className={classes.filterGroup}>
              <FormGroup>
                {LIFECYCLE_STAGES.map((lifecycle) => (
                  <FormControlLabel
                    key={lifecycle.value}
                    control={
                      <Checkbox
                        checked={(
                          (filters.lifecycle as string[]) || []
                        ).includes(lifecycle.value)}
                        onChange={(e) =>
                          handleLifecycleChange(
                            lifecycle.value,
                            e.target.checked,
                          )
                        }
                        size="small"
                      />
                    }
                    label={
                      <Box className={classes.facetItem}>
                        <span>{lifecycle.label}</span>
                        {lifecycle.count > 0 && (
                          <Box className={classes.facetCount}>
                            {lifecycle.count}
                          </Box>
                        )}
                      </Box>
                    }
                  />
                ))}
              </FormGroup>
            </FormControl>
          </AccordionDetails>
        </Accordion>

        <Accordion className={classes.filterSection}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2">Owner</Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.filterContent}>
            <TextField
              className={classes.searchField}
              size="small"
              placeholder="Filter by owner..."
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleOwnerFilter(ownerFilter);
                }
              }}
              onBlur={() => handleOwnerFilter(ownerFilter)}
              variant="outlined"
            />
          </AccordionDetails>
        </Accordion>
      </InfoCard>
    </Box>
  );
};
