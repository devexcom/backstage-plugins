import React from 'react';
import { IconButton, Tooltip, Box, makeStyles } from '@material-ui/core';
import {
  Launch as LaunchIcon,
  MenuBook as DocsIcon,
  GitHub as SourceIcon,
  Code as ApiIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@material-ui/icons';
import { Entity } from '@backstage/catalog-model';
import { Link } from '@backstage/core-components';
import { useApi, analyticsApiRef } from '@backstage/core-plugin-api';
import { getEntityUrl, getTechDocsUrl } from '../../utils/entityUtils';

const useStyles = makeStyles((theme) => ({
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  },
  actionButton: {
    'color': theme.palette.text.secondary,
    '&:hover': {
      color: theme.palette.primary.main,
      backgroundColor: theme.palette.action.hover,
    },
  },
  favoriteButton: {
    '&.favorited': {
      color: theme.palette.warning.main,
    },
  },
}));

interface EntityCardActionsProps {
  entity: Entity;
  onActionClick?: (action: string, entity: Entity) => void;
}

export const EntityCardActions: React.FC<EntityCardActionsProps> = ({
  entity,
  onActionClick,
}) => {
  const classes = useStyles();
  const analyticsApi = useApi(analyticsApiRef);
  const { metadata, spec } = entity;

  const handleActionClick = (action: string, event?: React.MouseEvent) => {
    event?.stopPropagation(); // Prevent card click
    analyticsApi.captureEvent('catalog_card_action_click');
    onActionClick?.(action, entity);
  };

  const entityUrl = getEntityUrl(entity);
  const techDocsUrl = getTechDocsUrl(entity);
  const sourceUrl = metadata.annotations?.['backstage.io/source-location'];
  const apiDefinitionUrl =
    metadata.annotations?.['backstage.io/api-definition'];

  return (
    <Box className={classes.actions}>
      {/* Favorite toggle */}
      <Tooltip title="Add to favorites">
        <IconButton
          className={`${classes.actionButton} ${classes.favoriteButton}`}
          size="small"
          onClick={(e) => handleActionClick('toggle_favorite', e)}
        >
          <StarBorderIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {/* External actions */}
      {techDocsUrl && (
        <Tooltip title="View documentation">
          <IconButton
            component={Link}
            to={techDocsUrl}
            className={classes.actionButton}
            size="small"
            onClick={(e) => handleActionClick('view_docs', e)}
          >
            <DocsIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {sourceUrl && (
        <Tooltip title="View source">
          <IconButton
            component="a"
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.actionButton}
            size="small"
            onClick={(e) => handleActionClick('view_source', e)}
          >
            <SourceIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {apiDefinitionUrl && (
        <Tooltip title="View API definition">
          <IconButton
            component="a"
            href={apiDefinitionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={classes.actionButton}
            size="small"
            onClick={(e) => handleActionClick('view_api', e)}
          >
            <ApiIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {/* Main action - always visible */}
      {entityUrl && (
        <Tooltip title="View details">
          <IconButton
            component={Link}
            to={entityUrl}
            className={classes.actionButton}
            size="small"
            onClick={(e) => handleActionClick('view_details', e)}
          >
            <LaunchIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};
