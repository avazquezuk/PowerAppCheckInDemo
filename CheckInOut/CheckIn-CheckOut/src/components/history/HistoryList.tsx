import React from 'react';
import {
  makeStyles,
  tokens,
  Text,
} from '@fluentui/react-components';
import { HistoryRegular } from '@fluentui/react-icons';
import { CheckInOutRecord, Location } from '@/types';
import HistoryItem from './HistoryItem';
import { LoadingSpinner } from '@/components/common';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalS,
  },
  title: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacingVerticalXXL,
    color: tokens.colorNeutralForeground3,
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: tokens.spacingVerticalM,
    opacity: 0.5,
  },
});

interface HistoryListProps {
  records: CheckInOutRecord[];
  locations: Location[];
  loading?: boolean;
  showHeader?: boolean;
}

const HistoryList: React.FC<HistoryListProps> = ({
  records,
  locations,
  loading = false,
  showHeader = true,
}) => {
  const styles = useStyles();

  const getLocation = (locationId: string) => 
    locations.find(l => l.id === locationId);

  if (loading) {
    return <LoadingSpinner label="Loading history..." />;
  }

  return (
    <div className={styles.container}>
      {showHeader && (
        <div className={styles.header}>
          <HistoryRegular />
          <Text className={styles.title}>Recent Activity</Text>
        </div>
      )}

      {records.length === 0 ? (
        <div className={styles.emptyState}>
          <HistoryRegular className={styles.emptyIcon} />
          <Text>No check-in records found.</Text>
          <Text>Your activity will appear here after you check in.</Text>
        </div>
      ) : (
        records.map(record => (
          <HistoryItem
            key={record.id}
            record={record}
            location={getLocation(record.locationId)}
          />
        ))
      )}
    </div>
  );
};

export default HistoryList;
