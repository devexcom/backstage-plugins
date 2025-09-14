import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { CARD_DIMENSIONS } from '../../constants';

const useStyles = makeStyles((theme) => ({
  skeletonCard: {
    padding: theme.spacing(2),
    height: CARD_DIMENSIONS.HEIGHT,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    display: 'flex',
    flexDirection: 'column',
  },
  skeletonHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  skeletonAvatar: {
    marginRight: theme.spacing(2),
  },
  skeletonContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  skeletonTags: {
    display: 'flex',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
  },
}));

interface EntityCardSkeletonProps {
  density?: 'comfortable' | 'compact';
}

export const EntityCardSkeleton: React.FC<EntityCardSkeletonProps> = ({
  density = 'comfortable',
}) => {
  const classes = useStyles();

  return (
    <Box className={classes.skeletonCard}>
      {/* Header with avatar and title */}
      <Box className={classes.skeletonHeader}>
        <Skeleton
          variant="circle"
          width={48}
          height={48}
          className={classes.skeletonAvatar}
        />
        <Box flex={1}>
          <Skeleton variant="text" width="70%" height={24} />
          <Skeleton variant="text" width="40%" height={16} />
        </Box>
      </Box>

      {/* Content area */}
      <Box className={classes.skeletonContent}>
        <Skeleton variant="text" width="100%" height={16} />
        <Skeleton variant="text" width="85%" height={16} />
        {density === 'comfortable' && (
          <Skeleton variant="text" width="60%" height={16} />
        )}
      </Box>

      {/* Tags */}
      <Box className={classes.skeletonTags}>
        <Skeleton variant="rect" width={60} height={24} />
        <Skeleton variant="rect" width={80} height={24} />
        <Skeleton variant="rect" width={45} height={24} />
      </Box>
    </Box>
  );
};
