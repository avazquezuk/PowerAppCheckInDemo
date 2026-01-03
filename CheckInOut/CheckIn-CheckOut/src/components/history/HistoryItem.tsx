import React from 'react';
import {
  makeStyles,
  tokens,
  Card,
  Text,
  Badge,
} from '@fluentui/react-components';
import {
  ClockRegular,
  LocationRegular,
  NoteRegular,
  CalendarRegular,
} from '@fluentui/react-icons';
import { CheckInOutRecord, Location } from '@/types';
import { formatDate, formatTime, formatDuration, isToday } from '@/utils';

const useStyles = makeStyles({
  card: {
    padding: tokens.spacingVerticalM,
    marginBottom: tokens.spacingVerticalS,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: tokens.spacingVerticalS,
  },
  dateSection: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  date: {
    fontWeight: tokens.fontWeightSemibold,
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
  detailIcon: {
    color: tokens.colorNeutralForeground3,
    fontSize: '16px',
  },
  duration: {
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
  },
  notes: {
    fontStyle: 'italic',
    color: tokens.colorNeutralForeground3,
  },
  inProgress: {
    color: tokens.colorPaletteGreenForeground1,
  },
});

interface HistoryItemProps {
  record: CheckInOutRecord;
  location?: Location;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ record, location }) => {
  const styles = useStyles();
  const isInProgress = !record.checkOutTime;
  const todayRecord = isToday(record.checkInTime);

  const getDuration = () => {
    if (record.durationMinutes !== null) {
      return record.durationMinutes;
    }
    // Calculate ongoing duration
    const checkInTime = record.checkInTime instanceof Date 
      ? record.checkInTime 
      : new Date(record.checkInTime);
    return Math.floor((Date.now() - checkInTime.getTime()) / (1000 * 60));
  };

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <div className={styles.dateSection}>
          <CalendarRegular className={styles.detailIcon} />
          <Text className={styles.date}>
            {todayRecord ? 'Today' : formatDate(record.checkInTime)}
          </Text>
        </div>
        {isInProgress ? (
          <Badge color="success" appearance="filled">In Progress</Badge>
        ) : (
          <Text className={styles.duration}>{formatDuration(getDuration())}</Text>
        )}
      </div>

      <div className={styles.details}>
        <div className={styles.detailRow}>
          <LocationRegular className={styles.detailIcon} />
          <Text>{location?.name || 'Unknown Location'}</Text>
        </div>
        
        <div className={styles.detailRow}>
          <ClockRegular className={styles.detailIcon} />
          <Text>
            {formatTime(record.checkInTime)}
            {record.checkOutTime && ` - ${formatTime(record.checkOutTime)}`}
            {isInProgress && <span className={styles.inProgress}> (ongoing)</span>}
          </Text>
        </div>

        {record.entryEmployeeComment && (
          <div className={styles.detailRow}>
            <NoteRegular className={styles.detailIcon} />
            <Text className={styles.notes}>{record.entryEmployeeComment}</Text>
          </div>
        )}
      </div>
    </Card>
  );
};

export default HistoryItem;
