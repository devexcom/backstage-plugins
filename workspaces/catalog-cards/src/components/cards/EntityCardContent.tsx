import React from 'react';
import { Typography, Box, Chip, makeStyles } from '@material-ui/core';
import { Entity } from '@backstage/catalog-model';
import { extractEntityMetadata } from '../../utils/entityUtils';

const useStyles = makeStyles((theme) => ({
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  description: {
    marginBottom: theme.spacing(2),
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
    lineHeight: 1.5,
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(0.5),
    marginTop: 'auto',
  },
  tag: {
    'height': '24px',
    'fontSize': '0.75rem',
    'backgroundColor': theme.palette.grey[100],
    'color': theme.palette.text.secondary,
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  moreTag: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
  emptyState: {
    color: theme.palette.text.disabled,
    fontStyle: 'italic',
    fontSize: '0.875rem',
  },
}));

interface EntityCardContentProps {
  entity: Entity;
  density?: 'comfortable' | 'compact';
}

export const EntityCardContent: React.FC<EntityCardContentProps> = ({
  entity,
  density = 'comfortable',
}) => {
  const classes = useStyles();
  const { description, tags } = extractEntityMetadata(entity);

  const maxTags = density === 'compact' ? 3 : 5;
  const visibleTags = tags.slice(0, maxTags);
  const hiddenTagsCount = tags.length - maxTags;

  return (
    <Box className={classes.content}>
      {/* Description */}
      <Typography
        className={classes.description}
        style={{
          WebkitLineClamp: density === 'compact' ? 3 : 4,
          maxHeight: density === 'compact' ? '3.9375rem' : '5.25rem', // 3 or 4 lines max
        }}
      >
        {description || 'No description available for this entity.'}
      </Typography>

      {/* Tags */}
      {tags.length > 0 && (
        <Box className={classes.tags}>
          {visibleTags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              variant="outlined"
              className={classes.tag}
              clickable
            />
          ))}
          {hiddenTagsCount > 0 && (
            <Chip
              label={`+${hiddenTagsCount}`}
              size="small"
              className={`${classes.tag} ${classes.moreTag}`}
              clickable
            />
          )}
        </Box>
      )}
    </Box>
  );
};
