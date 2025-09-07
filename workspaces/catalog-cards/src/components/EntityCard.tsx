import React from 'react';
import { Link } from '@backstage/core-components';
import {
  Card,
  CardContent,
  Chip,
  Typography,
  IconButton,
  makeStyles,
  Tooltip,
  Avatar,
} from '@material-ui/core';
import {
  Launch as LaunchIcon,
  MenuBook as DocsIcon,
  GitHub as SourceIcon,
  Code as ApiIcon,
} from '@material-ui/icons';
import { Entity } from '@backstage/catalog-model';
import { useApi, analyticsApiRef } from '@backstage/core-plugin-api';
import { EntityCardProps } from '../types';
import {
  extractEntityMetadata,
  getEntityTypeDisplayName,
  getEntityUrl,
  getTechDocsUrl,
} from '../utils/entityUtils';

const useStyles = makeStyles((theme) => ({
  card: {
    'height': '100%',
    'display': 'flex',
    'flexDirection': 'column',
    'cursor': 'pointer',
    'transition': theme.transitions.create(['box-shadow', 'transform'], {
      duration: theme.transitions.duration.short,
    }),
    '&:hover': {
      boxShadow: theme.shadows[4],
      transform: 'translateY(-1px)',
    },
  },
  cardContent: {
    'flex': 1,
    'display': 'flex',
    'flexDirection': 'column',
    'padding': theme.spacing(3),
    '&:last-child': {
      paddingBottom: theme.spacing(3),
    },
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    flex: 1,
    minWidth: 0,
  },
  avatar: {
    width: 48,
    height: 48,
    marginRight: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    fontSize: '1.1rem',
    fontWeight: 500,
  },
  titleSection: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontWeight: 500,
    textDecoration: 'none',
    fontSize: '1rem',
    lineHeight: 1.4,
  },
  description: {
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(2.5),
    fontSize: '0.875rem',
    lineHeight: 1.5,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    fontWeight: 400,
  },
  entityInfo: {
    color: theme.palette.text.secondary,
    fontSize: '0.75rem',
    lineHeight: 1.4,
    fontWeight: 400,
    marginTop: 'auto',
    paddingTop: theme.spacing(1),
    borderTop: `1px solid ${theme.palette.divider}`,
    marginBottom: theme.spacing(1),
  },
  statusSection: {
    marginBottom: theme.spacing(2),
  },
  lifecycle: {
    'fontSize': '0.75rem',
    'height': 22,
    'fontWeight': 500,
    'backgroundColor': theme.palette.primary.main,
    'color': theme.palette.primary.contrastText,
    '&.experimental': {
      backgroundColor: '#1976d2', // Professional blue
      color: 'white',
    },
    '&.production': {
      backgroundColor: '#2e7d32', // Professional green
      color: 'white',
    },
  },
  metadata: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.75),
    marginBottom: theme.spacing(2.5),
  },
  tag: {
    fontSize: '0.75rem',
    height: 26,
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.text.secondary,
    border: 'none',
    fontWeight: 400,
  },
  infoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(2),
    color: theme.palette.text.secondary,
    fontSize: '0.813rem',
  },
  infoBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButtons: {
    display: 'flex',
    gap: theme.spacing(0.5),
  },
  compactCard: {
    '& $cardContent': {
      padding: theme.spacing(1.5),
    },
    '& $avatar': {
      width: 32,
      height: 32,
      marginRight: theme.spacing(1.5),
    },
  },
}));

export const EntityCard: React.FC<EntityCardProps> = ({
  entity,
  density = 'comfortable',
  onClick,
}) => {
  const classes = useStyles();
  const analyticsApi = useApi(analyticsApiRef);

  const metadata = extractEntityMetadata(entity);
  const isCompact = density === 'compact';

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on interactive elements
    if ((e.target as HTMLElement).closest('button, a')) {
      return;
    }

    if (onClick) {
      onClick(entity);
    } else {
      // Let the Link component handle navigation
      const link = e.currentTarget.querySelector(
        'a[href]',
      ) as HTMLAnchorElement;
      if (link) {
        link.click();
      }
    }

    analyticsApi.captureEvent({
      action: 'catalog_card_click',
      subject: 'entity',
      context: {} as any,
    });
  };

  // Create entity initials for avatar
  const getEntityInitials = (entity: Entity) => {
    const name = entity.metadata.name || '';
    return name
      .split('-')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card
      className={`${classes.card} ${isCompact ? classes.compactCard : ''}`}
      onClick={handleCardClick}
      elevation={1}
    >
      <CardContent className={classes.cardContent}>
        {/* Header with Avatar and Lifecycle */}
        <div className={classes.header}>
          <div className={classes.headerLeft}>
            <Avatar className={classes.avatar}>
              {getEntityInitials(entity)}
            </Avatar>
            <div className={classes.titleSection}>
              <Typography
                variant="h6"
                className={classes.title}
                component={Link}
                to={getEntityUrl(entity)}
                color="inherit"
              >
                {metadata.title}
              </Typography>
            </div>
          </div>

          {/* Lifecycle Status - Top Right */}
          {metadata.lifecycle && (
            <Chip
              size="small"
              label={metadata.lifecycle}
              className={`${classes.lifecycle} ${metadata.lifecycle}`}
            />
          )}
        </div>

        {/* Description */}
        {metadata.description && (
          <Typography className={classes.description}>
            {metadata.description}
          </Typography>
        )}

        {/* Tags */}
        {metadata.tags.length > 0 && (
          <div className={classes.metadata}>
            {metadata.tags.slice(0, isCompact ? 2 : 4).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                className={classes.tag}
              />
            ))}
            {metadata.tags.length > (isCompact ? 2 : 4) && (
              <Chip
                label={`+${metadata.tags.length - (isCompact ? 2 : 4)}`}
                size="small"
                className={classes.tag}
              />
            )}
          </div>
        )}

        {/* Entity Info */}
        <div className={classes.entityInfo}>
          {getEntityTypeDisplayName(entity.kind, metadata.type)}
          {metadata.owner && ` • ${metadata.owner}`}
          {metadata.system && ` • ${metadata.system}`}
        </div>

        {/* Bottom Row - Info & Actions */}
        <div className={classes.actions}>
          {/* Left: Info badges */}
          <div className={classes.infoSection}>
            {metadata.hasTechDocs && (
              <div className={classes.infoBadge}>
                <DocsIcon style={{ fontSize: '1rem' }} />
                <span>Docs</span>
              </div>
            )}
            {metadata.apiCount > 0 && (
              <div className={classes.infoBadge}>
                <ApiIcon style={{ fontSize: '1rem' }} />
                <span>
                  {metadata.apiCount} API{metadata.apiCount > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          {/* Right: Action buttons */}
          <div className={classes.actionButtons}>
            {metadata.hasTechDocs && (
              <Tooltip title="View Documentation">
                <IconButton
                  size="small"
                  component={Link}
                  to={getTechDocsUrl(entity) || ''}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <DocsIcon />
                </IconButton>
              </Tooltip>
            )}
            {metadata.sourceUrl && (
              <Tooltip title="View Source">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(
                      metadata.sourceUrl,
                      '_blank',
                      'noopener,noreferrer',
                    );
                  }}
                >
                  <SourceIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Open Entity">
              <IconButton
                size="small"
                component={Link}
                to={getEntityUrl(entity)}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <LaunchIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
