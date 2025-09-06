import React, { useState } from 'react';
import { Link } from '@backstage/core-components';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
  IconButton,
  Collapse,
  makeStyles,
  Tooltip,
} from '@material-ui/core';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Launch as LaunchIcon,
  MenuBook as DocsIcon,
  GitHub as SourceIcon,
  Code as ApiIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@material-ui/icons';
import { Entity } from '@backstage/catalog-model';
import { useApi, analyticsApiRef } from '@backstage/core-plugin-api';
import { useRouteRef } from '@backstage/core-plugin-api';
import { EntityRefLink } from '@backstage/plugin-catalog-react';
import { EntityCardProps } from '../types';
import {
  extractEntityMetadata,
  getEntityTypeDisplayName,
  getLifecycleColor,
  truncateText,
  getEntityUrl,
  getTechDocsUrl,
  formatRelativeTime,
} from '../utils/entityUtils';

const useStyles = makeStyles((theme) => ({
  card: {
    'height': '100%',
    'display': 'flex',
    'flexDirection': 'column',
    'transition': 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    'cursor': 'pointer',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[4],
    },
  },
  cardContent: {
    'flexGrow': 1,
    'display': 'flex',
    'flexDirection': 'column',
    'gap': theme.spacing(1),
    'padding': theme.spacing(2),
    '&:last-child': {
      paddingBottom: theme.spacing(2),
    },
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  titleSection: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    'fontWeight': 600,
    'lineHeight': 1.3,
    'cursor': 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  subtitle: {
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
    marginTop: theme.spacing(0.5),
  },
  starButton: {
    marginLeft: theme.spacing(1),
  },
  metadata: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  metadataItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
  },
  description: {
    color: theme.palette.text.secondary,
    lineHeight: 1.5,
    flexGrow: 1,
  },
  descriptionTruncated: {
    'display': '-webkit-box',
    '-webkit-line-clamp': 3,
    '-webkit-box-orient': 'vertical',
    'overflow': 'hidden',
  },
  descriptionExpanded: {
    marginBottom: theme.spacing(1),
  },
  expandButton: {
    alignSelf: 'flex-start',
    padding: theme.spacing(0.5),
    minWidth: 'auto',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5),
    marginTop: theme.spacing(1),
  },
  tag: {
    height: 24,
    fontSize: '0.75rem',
  },
  quickActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(1),
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  actionButtons: {
    display: 'flex',
    gap: theme.spacing(0.5),
  },
  badges: {
    display: 'flex',
    gap: theme.spacing(0.5),
  },
  badge: {
    height: 20,
    fontSize: '0.625rem',
    minWidth: 20,
  },
  compactCard: {
    '& $cardContent': {
      padding: theme.spacing(1.5),
    },
    '& $description': {
      fontSize: '0.875rem',
    },
  },
}));

export const EntityCard: React.FC<EntityCardProps> = ({
  entity,
  density = 'comfortable',
  expandDescriptionDefault = false,
  onClick,
  quickActions = [],
}) => {
  const classes = useStyles();
  const analyticsApi = useApi(analyticsApiRef);

  const [expanded, setExpanded] = useState(expandDescriptionDefault);
  const [isStarred, setIsStarred] = useState(false); // TODO: Integrate with StarredEntitiesApi

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
      // Default navigation
      window.open(getEntityUrl(entity), '_blank', 'noopener,noreferrer');
    }

    analyticsApi.captureEvent({
      action: 'catalog_card_click',
      subject: 'entity',
      context: {} as any,
    });
  };

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(getEntityUrl(entity), '_blank', 'noopener,noreferrer');

    analyticsApi.captureEvent({
      action: 'catalog_card_title_click',
      subject: 'entity',
      context: {} as any,
    });
  };

  const handleStarToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsStarred(!isStarred);

    analyticsApi.captureEvent({
      action: 'catalog_card_star_toggle',
      subject: 'entity',
      context: {} as any,
    });
  };

  const handleExpandToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const handleQuickAction = (actionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const action = quickActions.find((a) => a.id === actionId);
    if (action) {
      action.onClick(entity);
    }
  };

  const renderQuickActions = () => {
    const actions = [];

    // TechDocs action
    if (metadata.hasTechDocs) {
      const techDocsUrl = getTechDocsUrl(entity);
      if (techDocsUrl) {
        actions.push(
          <Tooltip key="techdocs" title="View Documentation">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                window.open(techDocsUrl, '_blank', 'noopener,noreferrer');
              }}
            >
              <DocsIcon />
            </IconButton>
          </Tooltip>,
        );
      }
    }

    // Source action
    if (metadata.sourceUrl) {
      actions.push(
        <Tooltip key="source" title="View Source">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              window.open(metadata.sourceUrl, '_blank', 'noopener,noreferrer');
            }}
          >
            <SourceIcon />
          </IconButton>
        </Tooltip>,
      );
    }

    // API action
    if (metadata.apiCount > 0) {
      actions.push(
        <Tooltip key="apis" title={`${metadata.apiCount} APIs`}>
          <IconButton size="small">
            <ApiIcon />
          </IconButton>
        </Tooltip>,
      );
    }

    // Custom actions
    quickActions
      .filter((action) => !action.isVisible || action.isVisible(entity))
      .forEach((action) => {
        const IconComponent = action.icon || LaunchIcon;
        actions.push(
          <Tooltip key={action.id} title={action.label}>
            <span>
              <IconButton
                size="small"
                disabled={action.isDisabled?.(entity)}
                onClick={(e) => handleQuickAction(action.id, e)}
              >
                <IconComponent />
              </IconButton>
            </span>
          </Tooltip>,
        );
      });

    return actions;
  };

  const renderBadges = () => {
    const badges = [];

    if (metadata.hasTechDocs) {
      badges.push(
        <Chip
          key="docs"
          label="Docs"
          size="small"
          variant="outlined"
          className={classes.badge}
        />,
      );
    }

    if (metadata.apiCount > 0) {
      badges.push(
        <Chip
          key="apis"
          label={`${metadata.apiCount} API${metadata.apiCount > 1 ? 's' : ''}`}
          size="small"
          variant="outlined"
          className={classes.badge}
        />,
      );
    }

    return badges;
  };

  const shouldShowDescription =
    metadata.description && metadata.description.length > 0;
  const truncatedDescription = metadata.description
    ? truncateText(metadata.description, 150)
    : '';
  const shouldShowExpandButton =
    metadata.description && metadata.description.length > 150;

  return (
    <Card
      className={`${classes.card} ${isCompact ? classes.compactCard : ''}`}
      onClick={handleCardClick}
    >
      <CardContent className={classes.cardContent}>
        {/* Header */}
        <div className={classes.headerContent}>
          <div className={classes.titleSection}>
            <Typography
              variant={isCompact ? 'subtitle1' : 'h6'}
              className={classes.title}
              onClick={handleTitleClick}
              noWrap
            >
              {metadata.title}
            </Typography>
            <div className={classes.subtitle}>
              {getEntityTypeDisplayName(entity.kind, metadata.type)}
              {metadata.owner && ` • ${metadata.owner}`}
              {metadata.lastUpdated &&
                ` • ${formatRelativeTime(metadata.lastUpdated)}`}
            </div>
          </div>

          <Tooltip title={isStarred ? 'Unstar' : 'Star'}>
            <IconButton
              size="small"
              className={classes.starButton}
              onClick={handleStarToggle}
            >
              {isStarred ? <StarIcon /> : <StarBorderIcon />}
            </IconButton>
          </Tooltip>
        </div>

        {/* Metadata */}
        <div className={classes.metadata}>
          {metadata.lifecycle && (
            <Chip
              size="small"
              label={metadata.lifecycle}
              color={getLifecycleColor(metadata.lifecycle)}
              className={classes.tag}
            />
          )}
          {metadata.system && (
            <div className={classes.metadataItem}>
              <span>System: {metadata.system}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {shouldShowDescription && (
          <div className={classes.description}>
            <Typography
              variant="body2"
              className={
                expanded
                  ? classes.descriptionExpanded
                  : classes.descriptionTruncated
              }
            >
              {expanded ? metadata.description : truncatedDescription}
            </Typography>
            {shouldShowExpandButton && (
              <Button
                size="small"
                className={classes.expandButton}
                onClick={handleExpandToggle}
                endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              >
                {expanded ? 'Show less' : 'Show more'}
              </Button>
            )}
          </div>
        )}

        {/* Tags */}
        {metadata.tags.length > 0 && (
          <div className={classes.tags}>
            {metadata.tags.slice(0, isCompact ? 3 : 5).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                className={classes.tag}
              />
            ))}
            {metadata.tags.length > (isCompact ? 3 : 5) && (
              <Chip
                label={`+${metadata.tags.length - (isCompact ? 3 : 5)}`}
                size="small"
                variant="outlined"
                className={classes.tag}
              />
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className={classes.quickActions}>
          <div className={classes.badges}>{renderBadges()}</div>

          <div className={classes.actionButtons}>
            {renderQuickActions()}
            <Tooltip title="Open Entity">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(
                    getEntityUrl(entity),
                    '_blank',
                    'noopener,noreferrer',
                  );
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
