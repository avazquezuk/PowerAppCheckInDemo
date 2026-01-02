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
  Text,
  Toast,
  ToastTitle,
  ToastBody,
  Toaster,
  useToastController,
  useId,
} from '@fluentui/react-components';
import { DoorArrowLeftRegular, LocationRegular, ClockRegular } from '@fluentui/react-icons';
import { CheckInOutRecord, Location, CheckOutFormData } from '@/types';
import { formatTime, formatDuration } from '@/utils';

const useStyles = makeStyles({
  button: {
    minWidth: '140px',
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  summary: {
    backgroundColor: tokens.colorNeutralBackground3,
    padding: tokens.spacingVerticalM,
    borderRadius: tokens.borderRadiusMedium,
  },
  summaryRow: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalXS,
  },
  summaryIcon: {
    color: tokens.colorBrandForeground1,
  },
  notesLabel: {
    fontWeight: tokens.fontWeightSemibold,
  },
});

interface CheckOutButtonProps {
  currentRecord: CheckInOutRecord;
  location: Location | null;
  onCheckOut: (data: CheckOutFormData) => Promise<{ success: boolean; error?: string }>;
  disabled?: boolean;
  loading?: boolean;
}

const CheckOutButton: React.FC<CheckOutButtonProps> = ({
  currentRecord,
  location,
  onCheckOut,
  disabled = false,
  loading = false,
}) => {
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toasterId = useId('toaster');
  const { dispatchToast } = useToastController(toasterId);

  // Calculate duration
  const getDuration = () => {
    const checkInTime = currentRecord.checkInTime instanceof Date 
      ? currentRecord.checkInTime 
      : new Date(currentRecord.checkInTime);
    return Math.floor((Date.now() - checkInTime.getTime()) / (1000 * 60));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const result = await onCheckOut({
        notes: notes.trim() || undefined,
      });

      if (result.success) {
        setOpen(false);
        setNotes('');
        const duration = getDuration();
        dispatchToast(
          <Toast>
            <ToastTitle>Checked Out Successfully</ToastTitle>
            <ToastBody>Total time: {formatDuration(duration)}</ToastBody>
          </Toast>,
          { intent: 'success' }
        );
      } else {
        dispatchToast(
          <Toast>
            <ToastTitle>Check-Out Failed</ToastTitle>
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
            appearance="secondary"
            icon={<DoorArrowLeftRegular />}
            disabled={disabled || loading}
          >
            Check Out
          </Button>
        </DialogTrigger>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Check Out</DialogTitle>
            <DialogContent className={styles.dialogContent}>
              <div className={styles.summary}>
                <div className={styles.summaryRow}>
                  <LocationRegular className={styles.summaryIcon} />
                  <Text>{location?.name || 'Unknown Location'}</Text>
                </div>
                <div className={styles.summaryRow}>
                  <ClockRegular className={styles.summaryIcon} />
                  <Text>Checked in at {formatTime(currentRecord.checkInTime)}</Text>
                </div>
                <div className={styles.summaryRow}>
                  <Text weight="semibold">Duration: {formatDuration(getDuration())}</Text>
                </div>
              </div>
              
              <div>
                <label className={styles.notesLabel}>Notes (optional)</label>
                <Textarea
                  placeholder="Add any notes about this check-out..."
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
                disabled={submitting}
              >
                {submitting ? 'Checking Out...' : 'Check Out'}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </>
  );
};

export default CheckOutButton;
