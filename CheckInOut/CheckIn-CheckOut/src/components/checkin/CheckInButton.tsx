import React, { useState } from 'react';
import {
  makeStyles,
  tokens,
  Button,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  Textarea,
  Toast,
  ToastTitle,
  ToastBody,
  Toaster,
  useToastController,
  useId,
} from '@fluentui/react-components';
import { SignOutRegular } from '@fluentui/react-icons';
import { Location, CheckInFormData } from '@/types';
import LocationSelector from './LocationSelector';

const useStyles = makeStyles({
  button: {
    minWidth: '140px',
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  notesLabel: {
    fontWeight: tokens.fontWeightSemibold,
  },
});

interface CheckInButtonProps {
  locations: Location[];
  recentLocationIds: string[];
  onCheckIn: (data: CheckInFormData) => Promise<{ success: boolean; error?: string }>;
  onLocationUsed: (locationId: string) => void;
  disabled?: boolean;
  loading?: boolean;
}

const CheckInButton: React.FC<CheckInButtonProps> = ({
  locations,
  recentLocationIds,
  onCheckIn,
  onLocationUsed,
  disabled = false,
  loading = false,
}) => {
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    recentLocationIds[0] || null
  );
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toasterId = useId('toaster');
  const { dispatchToast } = useToastController(toasterId);

  const handleSubmit = async () => {
    if (!selectedLocationId) return;

    setSubmitting(true);
    try {
      const result = await onCheckIn({
        locationId: selectedLocationId,
        notes: notes.trim() || undefined,
      });

      if (result.success) {
        onLocationUsed(selectedLocationId);
        setOpen(false);
        setNotes('');
        dispatchToast(
          <Toast>
            <ToastTitle>Checked In Successfully</ToastTitle>
            <ToastBody>You have been checked in.</ToastBody>
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
      setSubmitting(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      // Reset form when opening
      setSelectedLocationId(recentLocationIds[0] || null);
      setNotes('');
    }
  };

  return (
    <>
      <Toaster toasterId={toasterId} />
      <Dialog open={open} onOpenChange={(_, data) => handleOpenChange(data.open)}>
        <DialogTrigger disableButtonEnhancement>
          <Button
            className={styles.button}
            appearance="primary"
            icon={<SignOutRegular />}
            disabled={disabled || loading}
          >
            Check In
          </Button>
        </DialogTrigger>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Check In</DialogTitle>
            <DialogContent className={styles.dialogContent}>
              <LocationSelector
                locations={locations}
                selectedLocationId={selectedLocationId}
                onSelect={setSelectedLocationId}
                recentLocationIds={recentLocationIds}
                disabled={submitting}
              />
              
              <div>
                <label className={styles.notesLabel}>Notes (optional)</label>
                <Textarea
                  placeholder="Add any notes about this check-in..."
                  value={notes}
                  onChange={(_, data) => setNotes(data.value)}
                  disabled={submitting}
                  resize="vertical"
                />
              </div>
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary" disabled={submitting}>
                  Cancel
                </Button>
              </DialogTrigger>
              <Button
                appearance="primary"
                onClick={handleSubmit}
                disabled={!selectedLocationId || submitting}
              >
                {submitting ? 'Checking In...' : 'Check In'}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
};

export default CheckInButton;
