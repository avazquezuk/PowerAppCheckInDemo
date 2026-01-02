import React from 'react';
import {
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { AppLayout, LoadingSpinner, ErrorMessage } from '@/components/common';
import { CurrentStatus } from '@/components/checkin';
import QuickActions from './QuickActions';
import {
  useEmployee,
  useLocations,
  useRecentLocations,
  useCheckIn,
} from '@/hooks';

const useStyles = makeStyles({
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: tokens.spacingVerticalL,
  },
  mainColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
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

  // Loading state
  const isLoading = employeeLoading || locationsLoading || statusLoading;

  if (isLoading) {
    return (
      <AppLayout>
        <LoadingSpinner label="Loading your dashboard..." />
      </AppLayout>
    );
  }

  if (employeeError) {
    return (
      <AppLayout>
        <div className={styles.content}>
          <ErrorMessage 
            message={employeeError} 
            title="Unable to load employee data"
          />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout employee={employee}>
      <div className={styles.content}>
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
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
