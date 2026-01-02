import React, { useMemo } from 'react';
import {
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { Employee } from '@/types';
import { Header, LoadingSpinner, ErrorMessage } from '@/components/common';
import { CurrentStatus } from '@/components/checkin';
import { HistoryList } from '@/components/history';
import QuickActions from './QuickActions';
import TimeSummary from './TimeSummary';
import {
  useEmployee,
  useLocations,
  useRecentLocations,
  useCheckIn,
  useHistory,
  useTimeSummary,
  getWeekRange,
} from '@/hooks';

const useStyles = makeStyles({
  container: {
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: tokens.spacingVerticalL,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: tokens.spacingVerticalM,
  },
  mainColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  sideColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  section: {
    marginTop: tokens.spacingVerticalL,
  },
});

const Dashboard: React.FC = () => {
  const styles = useStyles();

  // Fetch employee data
  const { employee, loading: employeeLoading, error: employeeError } = useEmployee();
  
  // Fetch locations
  const { locations, loading: locationsLoading } = useLocations();
  
  // Recent locations
  const { recentIds, addRecentLocation } = useRecentLocations();
  
  // Check-in status
  const {
    status,
    loading: statusLoading,
    actionLoading,
    isCheckedIn,
    checkIn,
    checkOut,
  } = useCheckIn(employee?.id || null);
  
  // History
  const { records, loading: historyLoading } = useHistory(employee?.id || null);
  
  // Time summary for current week - memoize to prevent infinite re-renders
  const weekRange = useMemo(() => getWeekRange(), []);
  const { summary, loading: summaryLoading } = useTimeSummary(
    employee?.id || null,
    weekRange.start,
    weekRange.end
  );

  // Loading state
  const isLoading = employeeLoading || locationsLoading || statusLoading;

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Header />
        <LoadingSpinner label="Loading your dashboard..." />
      </div>
    );
  }

  if (employeeError) {
    return (
      <div className={styles.container}>
        <Header />
        <div className={styles.content}>
          <ErrorMessage 
            message={employeeError} 
            title="Unable to load employee data"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header employee={employee} />
      
      <div className={styles.content}>
        <div className={styles.grid}>
          <div className={styles.mainColumn}>
            {/* Current Status */}
            {status && (
              <CurrentStatus
                status={status}
                location={status.location}
              />
            )}

            {/* Quick Actions */}
            <QuickActions
              isCheckedIn={isCheckedIn}
              currentRecord={status?.currentRecord || null}
              currentLocation={status?.location || null}
              locations={locations}
              recentLocationIds={recentIds}
              onCheckIn={checkIn}
              onCheckOut={checkOut}
              onLocationUsed={addRecentLocation}
              loading={actionLoading}
            />

            {/* Recent History */}
            <div className={styles.section}>
              <HistoryList
                records={records.slice(0, 5)}
                locations={locations}
                loading={historyLoading}
              />
            </div>
          </div>

          <div className={styles.sideColumn}>
            {/* Time Summary */}
            <TimeSummary
              summary={summary}
              loading={summaryLoading}
              title="This Week"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
