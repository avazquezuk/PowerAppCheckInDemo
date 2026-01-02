import React from 'react';
import {
  makeStyles,
  tokens,
  Card,
  Text,
} from '@fluentui/react-components';
import { Location, CheckInOutRecord, CheckInFormData, CheckOutFormData } from '@/types';
import { CheckInButton, CheckOutButton } from '@/components/checkin';

const useStyles = makeStyles({
  card: {
    padding: tokens.spacingVerticalL,
  },
  header: {
    marginBottom: tokens.spacingVerticalM,
  },
  title: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
  },
  actions: {
    display: 'flex',
    gap: tokens.spacingHorizontalM,
    justifyContent: 'center',
  },
});

interface QuickActionsProps {
  isCheckedIn: boolean;
  currentRecord: CheckInOutRecord | null;
  currentLocation: Location | null;
  locations: Location[];
  recentLocationIds: string[];
  onCheckIn: (data: CheckInFormData) => Promise<{ success: boolean; error?: string }>;
  onCheckOut: (data: CheckOutFormData) => Promise<{ success: boolean; error?: string }>;
  onLocationUsed: (locationId: string) => void;
  loading?: boolean;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  isCheckedIn,
  currentRecord,
  currentLocation,
  locations,
  recentLocationIds,
  onCheckIn,
  onCheckOut,
  onLocationUsed,
  loading = false,
}) => {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <Text className={styles.title}>Quick Actions</Text>
      </div>

      <div className={styles.actions}>
        {!isCheckedIn ? (
          <CheckInButton
            locations={locations}
            recentLocationIds={recentLocationIds}
            onCheckIn={onCheckIn}
            onLocationUsed={onLocationUsed}
            loading={loading}
          />
        ) : (
          currentRecord && (
            <CheckOutButton
              currentRecord={currentRecord}
              location={currentLocation}
              onCheckOut={onCheckOut}
              loading={loading}
            />
          )
        )}
      </div>
    </Card>
  );
};

export default QuickActions;
