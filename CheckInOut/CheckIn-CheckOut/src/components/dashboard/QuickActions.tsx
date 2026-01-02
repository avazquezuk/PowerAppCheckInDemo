import React, { useState } from 'react';
import {
  makeStyles,
  tokens,
  Card,
  Text,
  Button,
  Toast,
  ToastTitle,
  ToastBody,
  Toaster,
  useToastController,
  useId,
} from '@fluentui/react-components';
import { FlashRegular, LocationRegular } from '@fluentui/react-icons';
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
    flexWrap: 'wrap',
  },
  quickCheckIn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: tokens.spacingVerticalXS,
  },
  quickLocation: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
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
  const [quickCheckInLoading, setQuickCheckInLoading] = useState(false);
  
  const toasterId = useId('quick-toaster');
  const { dispatchToast } = useToastController(toasterId);

  // Get the most recent location for quick check-in
  const recentLocation = recentLocationIds.length > 0 
    ? locations.find(l => l.id === recentLocationIds[0])
    : null;

  const handleQuickCheckIn = async () => {
    if (!recentLocation) return;
    
    setQuickCheckInLoading(true);
    try {
      const result = await onCheckIn({ locationId: recentLocation.id });
      if (result.success) {
        onLocationUsed(recentLocation.id);
        dispatchToast(
          <Toast>
            <ToastTitle>Checked In Successfully</ToastTitle>
            <ToastBody>Quick check-in to {recentLocation.name}</ToastBody>
          </Toast>,
          { intent: 'success' }
        );
      } else {
        dispatchToast(
          <Toast>
            <ToastTitle>Check-In Failed</ToastTitle>
            <ToastBody>{result.error || 'An error occurred'}</ToastBody>
          </Toast>,
          { intent: 'error' }
        );
      }
    } finally {
      setQuickCheckInLoading(false);
    }
  };

  return (
    <>
      <Toaster toasterId={toasterId} />
      <Card className={styles.card}>
        <div className={styles.header}>
          <Text className={styles.title}>Quick Actions</Text>
        </div>

        <div className={styles.actions}>
          {!isCheckedIn ? (
            <>
              {/* Quick one-tap check-in to recent location */}
              {recentLocation && (
                <div className={styles.quickCheckIn}>
                  <Button
                    appearance="primary"
                    icon={<FlashRegular />}
                    onClick={handleQuickCheckIn}
                    disabled={loading || quickCheckInLoading}
                  >
                    {quickCheckInLoading ? 'Checking In...' : 'Quick Check In'}
                  </Button>
                  <span className={styles.quickLocation}>
                    <LocationRegular fontSize={12} />
                    {recentLocation.name}
                  </span>
                </div>
              )}
              
              {/* Full check-in with location selection */}
              <CheckInButton
                locations={locations}
                recentLocationIds={recentLocationIds}
                onCheckIn={onCheckIn}
                onLocationUsed={onLocationUsed}
                loading={loading}
              />
            </>
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
    </>
  );
};

export default QuickActions;
