import React from 'react';
import { makeStyles } from '@material-ui/core';
import { InfoCard } from '@backstage/core-components';
import { Entity } from '@backstage/catalog-model';
import { useApi, analyticsApiRef } from '@backstage/core-plugin-api';
import { EntityCardProps } from '../types';
import {
  EntityCardHeader,
  EntityCardContent,
  EntityCardMetadata,
  EntityCardActions,
} from './cards';

const useStyles = makeStyles((theme) => ({
  cardWrapper: {
    'height': '100%',
    'cursor': 'pointer',
    'transition': theme.transitions.create(['box-shadow', 'transform'], {
      duration: theme.transitions.duration.short,
    }),
    '&:hover': {
      boxShadow: theme.shadows[4],
      transform: 'translateY(-2px)',
    },
    '& .MuiCard-root': {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
  },
  header: {
    backgroundColor: theme.palette.grey[50],
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  cardContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
  },
  cardFooter: {
    borderTop: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1.5, 2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.palette.background.default,
  },
}));

export const EntityCard: React.FC<EntityCardProps> = ({
  entity,
  density = 'comfortable',
  onClick,
}) => {
  const classes = useStyles();
  const analyticsApi = useApi(analyticsApiRef);

  const handleClick = () => {
    analyticsApi.captureEvent('catalog_card_click');
    onClick?.(entity);
  };

  const handleActionClick = (action: string, actionEntity: Entity) => {
    analyticsApi.captureEvent('catalog_card_action_click');
  };

  return (
    <div onClick={handleClick} className={classes.cardWrapper}>
      <InfoCard noPadding>
        {/* Header with solid background */}
        <div className={classes.header}>
          <div className={classes.headerContent}>
            <EntityCardHeader entity={entity} />
          </div>
          <EntityCardActions
            entity={entity}
            onActionClick={handleActionClick}
          />
        </div>

        {/* Content area */}
        <div className={classes.cardContent}>
          <EntityCardContent entity={entity} density={density} />
        </div>

        {/* Footer with metadata */}
        <div className={classes.cardFooter}>
          <EntityCardMetadata entity={entity} />
        </div>
      </InfoCard>
    </div>
  );
};
