import React from 'react';
import { Typography, Avatar, Box, makeStyles } from '@material-ui/core';
import { Entity } from '@backstage/catalog-model';
import { Link } from '@backstage/core-components';
import {
  getEntityTypeDisplayName,
  getEntityUrl,
} from '../../utils/entityUtils';

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  avatar: {
    marginRight: theme.spacing(1.5),
    width: theme.spacing(5),
    height: theme.spacing(5),
    backgroundColor: theme.palette.primary.main,
    fontSize: '0.875rem',
    fontWeight: 600,
  },
  titleSection: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    'fontWeight': 600,
    'fontSize': '1rem',
    'lineHeight': 1.2,
    'marginBottom': theme.spacing(0.25),
    '& a': {
      'color': 'inherit',
      'textDecoration': 'none',
      '&:hover': {
        color: theme.palette.primary.main,
        textDecoration: 'underline',
      },
    },
  },
  subtitle: {
    color: theme.palette.text.secondary,
    fontSize: '0.75rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
}));

interface EntityCardHeaderProps {
  entity: Entity;
}

export const EntityCardHeader: React.FC<EntityCardHeaderProps> = ({
  entity,
}) => {
  const classes = useStyles();
  const { metadata } = entity;
  const entityUrl = getEntityUrl(entity);
  const typeDisplayName = getEntityTypeDisplayName(
    entity.kind,
    entity.spec?.type,
  );

  const getAvatarContent = () => {
    const avatarUrl = metadata.annotations?.['backstage.io/avatar-url'];
    if (avatarUrl) {
      return null; // Will use src prop
    }
    return (metadata.title || metadata.name).charAt(0).toUpperCase();
  };

  return (
    <Box className={classes.header}>
      <Avatar
        className={classes.avatar}
        src={metadata.annotations?.['backstage.io/avatar-url']}
      >
        {getAvatarContent()}
      </Avatar>

      <Box className={classes.titleSection}>
        <Typography
          variant="h6"
          component="h3"
          className={classes.title}
          noWrap
        >
          {entityUrl ? (
            <Link to={entityUrl}>{metadata.title || metadata.name}</Link>
          ) : (
            metadata.title || metadata.name
          )}
        </Typography>

        <Typography className={classes.subtitle}>{typeDisplayName}</Typography>
      </Box>
    </Box>
  );
};
