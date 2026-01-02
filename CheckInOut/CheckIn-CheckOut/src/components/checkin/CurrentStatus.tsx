import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  tokens,
  Card,
  CardHeader,
  Text,
  Badge,
} from '@fluentui/react-components';
import {
  ClockRegular,
  LocationRegular,
  CheckmarkCircleRegular,
} from '@fluentui/react-icons';
import { CurrentStatus as CurrentStatusType, Location } from '@/types';
import { StatusBadge } from '@/components/common';
import { formatTime, formatDuration, getRelativeTime } from '@/utils';

const useStyles = makeStyles({
  card: {
    padding: tokens.spacingVerticalL,
  },
  statusSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: tokens.spacingVerticalM,
  },
  statusTitle: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    color: tokens.colorNeutralForeground2,
  },
  detailIcon: {
    color: tokens.colorBrandForeground1,
  },
  duration: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorBrandForeground1,
  },
  checkedOutMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    color: tokens.colorNeutralForeground3,
    fontStyle: 'italic',
  },
});

interface CurrentStatusProps {
  status: CurrentStatusType;
  location?: Location | null;
}

const CurrentStatus: React.FC<CurrentStatusProps> = ({ status, location }) => {
  const styles = useStyles();
  const [, setTick] = useState(0);

  // Update duration every minute
  useEffect(() => {
    if (status.status === 'checked-in') {
      const interval = setInterval(() => {
        setTick(t => t + 1);
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [status.status]);

  const isCheckedIn = status.status === 'checked-in';
  const record = status.currentRecord;

  // Calculate current duration
  const getDuration = () => {
    if (!record?.checkInTime) return 0;
    const checkInTime = record.checkInTime instanceof Date 
      ? record.checkInTime 
      : new Date(record.checkInTime);
    return Math.floor((Date.now() - checkInTime.getTime()) / (1000 * 60));
  };

  return (
    <Card className={styles.card}>
      <div className={styles.statusSection}>
        <Text className={styles.statusTitle}>Current Status</Text>
        <StatusBadge status={status.status} size="large" />
      </div>

      {isCheckedIn && record ? (
        <div className={styles.details}>
          <div className={styles.detailRow}>
            <LocationRegular className={styles.detailIcon} />
            <Text>{location?.name || 'Unknown Location'}</Text>
          </div>
          <div className={styles.detailRow}>
            <ClockRegular className={styles.detailIcon} />
            <Text>
              Checked in at {formatTime(record.checkInTime)} ({getRelativeTime(record.checkInTime)})
            </Text>
          </div>
          <div className={styles.detailRow}>
            <Text>Time spent:</Text>
            <Text className={styles.duration}>{formatDuration(getDuration())}</Text>
          </div>
        </div>
      ) : (
        <div className={styles.checkedOutMessage}>
          <CheckmarkCircleRegular />
          <Text>You are not currently checked in to any location.</Text>
        </div>
      )}
    </Card>
  );
};

export default CurrentStatus;
