import React from 'react';
import { Typography, Box, Chip, makeStyles } from '@material-ui/core';
import {
  Person as PersonIcon,
  Business as SystemIcon,
} from '@material-ui/icons';
import { Entity } from '@backstage/catalog-model';
import { Link } from '@backstage/core-components';
import { extractEntityMetadata } from '../../utils/entityUtils';

const useStyles = makeStyles((theme) => ({
  metadata: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    minHeight: '32px', // Consistent footer height even when empty
  },
  ownerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    flex: 1,
  },
  ownerItem: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
  },
  ownerIcon: {
    fontSize: '0.875rem',
  },
  ownerLink: {
    'color': theme.palette.text.secondary,
    'textDecoration': 'none',
    'fontWeight': 500,
    '&:hover': {
      color: theme.palette.primary.main,
      textDecoration: 'underline',
    },
  },
  lifecycleBadge: {
    'fontSize': '0.6875rem',
    'fontWeight': 500,
    'textTransform': 'uppercase',
    'height': '22px',
    '&.production': {
      backgroundColor: '#1976d2', // Professional dark blue
      color: 'white',
    },
    '&.experimental': {
      backgroundColor: '#42a5f5', // Professional medium blue
      color: 'white',
    },
    '&.deprecated': {
      backgroundColor: '#90caf9', // Professional light blue
      color: '#1565c0', // Darker blue text for contrast
    },
  },
}));

interface EntityCardMetadataProps {
  entity: Entity;
}

export const EntityCardMetadata: React.FC<EntityCardMetadataProps> = ({
  entity,
}) => {
  const classes = useStyles();
  const { owner, system, lifecycle } = extractEntityMetadata(entity);

  return (
    <Box className={classes.metadata}>
      <Box className={classes.ownerInfo}>
        {owner && (
          <Box className={classes.ownerItem}>
            <PersonIcon className={classes.ownerIcon} />
            <Link
              to={`/catalog/default/group/${owner}`}
              className={classes.ownerLink}
            >
              {owner}
            </Link>
          </Box>
        )}

        {system && (
          <Box className={classes.ownerItem}>
            <SystemIcon className={classes.ownerIcon} />
            <Link
              to={`/catalog/default/system/${system}`}
              className={classes.ownerLink}
            >
              {system}
            </Link>
          </Box>
        )}

        {/* Empty placeholder to maintain height when no metadata */}
        {!owner && !system && <Box />}
      </Box>

      {lifecycle && (
        <Chip
          label={lifecycle}
          size="small"
          className={`${classes.lifecycleBadge} ${lifecycle}`}
          variant="filled"
        />
      )}
    </Box>
  );
};
