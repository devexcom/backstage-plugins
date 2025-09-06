import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { Tooltip, makeStyles } from '@material-ui/core';
import {
  TableChart as TableIcon,
  ViewModule as CardsIcon,
} from '@material-ui/icons';
import { CatalogView, CatalogViewToggleProps } from '../types';

const useStyles = makeStyles((theme) => ({
  toggleGroup: {
    'border': `1px solid ${theme.palette.divider}`,
    'borderRadius': theme.shape.borderRadius,
    '& .MuiToggleButton-root': {
      'border': 'none',
      'borderRadius': 0,
      'padding': theme.spacing(0.5, 1),
      '&:not(:last-child)': {
        borderRight: `1px solid ${theme.palette.divider}`,
      },
      '&.Mui-selected': {
        'backgroundColor': theme.palette.primary.main,
        'color': theme.palette.primary.contrastText,
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
        },
      },
    },
  },
}));

export const CatalogViewToggle: React.FC<CatalogViewToggleProps> = ({
  view,
  onViewChange,
  disabled = false,
}) => {
  const classes = useStyles();

  const handleViewChange = (
    _: React.MouseEvent<HTMLElement>,
    newView: CatalogView | null,
  ) => {
    if (newView && newView !== view) {
      onViewChange(newView);
    }
  };

  return (
    <ToggleButtonGroup
      value={view}
      exclusive
      onChange={handleViewChange}
      className={classes.toggleGroup}
      size="small"
    >
      <ToggleButton value="table" aria-label="Table view">
        <Tooltip title="Table view">
          <TableIcon fontSize="small" />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="cards" aria-label="Cards view">
        <Tooltip title="Cards view">
          <CardsIcon fontSize="small" />
        </Tooltip>
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
