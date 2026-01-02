import React, { useState } from 'react';
import {
  makeStyles,
  tokens,
  Input,
  Button,
  Popover,
  PopoverTrigger,
  PopoverSurface,
  Text,
} from '@fluentui/react-components';
import { 
  CalendarRegular, 
  ChevronDownRegular,
  DismissRegular,
} from '@fluentui/react-icons';
import { startOfDay, endOfDay } from '@/utils';

const useStyles = makeStyles({
  trigger: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
  },
  surface: {
    padding: tokens.spacingVerticalM,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
    minWidth: '280px',
  },
  presets: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  presetsTitle: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
    marginBottom: tokens.spacingVerticalXS,
  },
  presetButton: {
    justifyContent: 'flex-start',
  },
  divider: {
    height: '1px',
    backgroundColor: tokens.colorNeutralStroke2,
    margin: `${tokens.spacingVerticalS} 0`,
  },
  customRange: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  customTitle: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
  },
  dateInputs: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    alignItems: 'center',
  },
  dateInput: {
    flex: 1,
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: tokens.spacingHorizontalS,
    marginTop: tokens.spacingVerticalS,
  },
});

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  onClear?: () => void;
}

type PresetKey = 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth' | 'last7Days' | 'last30Days';

interface Preset {
  label: string;
  getRange: () => DateRange;
}

const getPresets = (): Record<PresetKey, Preset> => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  
  return {
    today: {
      label: 'Today',
      getRange: () => ({
        start: startOfDay(today),
        end: endOfDay(today),
      }),
    },
    yesterday: {
      label: 'Yesterday',
      getRange: () => {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return {
          start: startOfDay(yesterday),
          end: endOfDay(yesterday),
        };
      },
    },
    thisWeek: {
      label: 'This Week',
      getRange: () => {
        const start = new Date(today);
        start.setDate(today.getDate() - dayOfWeek);
        const end = new Date(today);
        end.setDate(today.getDate() + (6 - dayOfWeek));
        return {
          start: startOfDay(start),
          end: endOfDay(end),
        };
      },
    },
    lastWeek: {
      label: 'Last Week',
      getRange: () => {
        const start = new Date(today);
        start.setDate(today.getDate() - dayOfWeek - 7);
        const end = new Date(today);
        end.setDate(today.getDate() - dayOfWeek - 1);
        return {
          start: startOfDay(start),
          end: endOfDay(end),
        };
      },
    },
    thisMonth: {
      label: 'This Month',
      getRange: () => ({
        start: startOfDay(new Date(today.getFullYear(), today.getMonth(), 1)),
        end: endOfDay(new Date(today.getFullYear(), today.getMonth() + 1, 0)),
      }),
    },
    lastMonth: {
      label: 'Last Month',
      getRange: () => ({
        start: startOfDay(new Date(today.getFullYear(), today.getMonth() - 1, 1)),
        end: endOfDay(new Date(today.getFullYear(), today.getMonth(), 0)),
      }),
    },
    last7Days: {
      label: 'Last 7 Days',
      getRange: () => {
        const start = new Date(today);
        start.setDate(today.getDate() - 6);
        return {
          start: startOfDay(start),
          end: endOfDay(today),
        };
      },
    },
    last30Days: {
      label: 'Last 30 Days',
      getRange: () => {
        const start = new Date(today);
        start.setDate(today.getDate() - 29);
        return {
          start: startOfDay(start),
          end: endOfDay(today),
        };
      },
    },
  };
};

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  onClear,
}) => {
  const styles = useStyles();
  const [open, setOpen] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  
  const presets = getPresets();

  const formatDateForDisplay = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const getDisplayText = (): string => {
    if (!value.start && !value.end) {
      return 'Select dates';
    }
    if (value.start && value.end) {
      // Check if it matches a preset
      for (const [, preset] of Object.entries(presets)) {
        const range = preset.getRange();
        if (
          range.start?.toDateString() === value.start.toDateString() &&
          range.end?.toDateString() === value.end.toDateString()
        ) {
          return preset.label;
        }
      }
      return `${formatDateForDisplay(value.start)} - ${formatDateForDisplay(value.end)}`;
    }
    return formatDateForDisplay(value.start || value.end);
  };

  const handlePresetClick = (presetKey: PresetKey) => {
    const range = presets[presetKey].getRange();
    onChange(range);
    setOpen(false);
  };

  const handleCustomApply = () => {
    const start = customStart ? startOfDay(new Date(customStart)) : null;
    const end = customEnd ? endOfDay(new Date(customEnd)) : null;
    onChange({ start, end });
    setOpen(false);
  };

  const handleClear = () => {
    onChange({ start: null, end: null });
    setCustomStart('');
    setCustomEnd('');
    onClear?.();
    setOpen(false);
  };

  const hasValue = value.start !== null || value.end !== null;

  return (
    <Popover open={open} onOpenChange={(_, data) => setOpen(data.open)}>
      <PopoverTrigger disableButtonEnhancement>
        <Button
          appearance={hasValue ? 'primary' : 'subtle'}
          icon={<CalendarRegular />}
          iconPosition="before"
          className={styles.trigger}
        >
          {getDisplayText()}
          <ChevronDownRegular />
        </Button>
      </PopoverTrigger>
      <PopoverSurface className={styles.surface}>
        <div className={styles.presets}>
          <Text className={styles.presetsTitle}>Quick Select</Text>
          <Button
            appearance="subtle"
            className={styles.presetButton}
            onClick={() => handlePresetClick('today')}
          >
            Today
          </Button>
          <Button
            appearance="subtle"
            className={styles.presetButton}
            onClick={() => handlePresetClick('yesterday')}
          >
            Yesterday
          </Button>
          <Button
            appearance="subtle"
            className={styles.presetButton}
            onClick={() => handlePresetClick('thisWeek')}
          >
            This Week
          </Button>
          <Button
            appearance="subtle"
            className={styles.presetButton}
            onClick={() => handlePresetClick('lastWeek')}
          >
            Last Week
          </Button>
          <Button
            appearance="subtle"
            className={styles.presetButton}
            onClick={() => handlePresetClick('thisMonth')}
          >
            This Month
          </Button>
          <Button
            appearance="subtle"
            className={styles.presetButton}
            onClick={() => handlePresetClick('last30Days')}
          >
            Last 30 Days
          </Button>
        </div>

        <div className={styles.divider} />

        <div className={styles.customRange}>
          <Text className={styles.customTitle}>Custom Range</Text>
          <div className={styles.dateInputs}>
            <Input
              type="date"
              className={styles.dateInput}
              value={customStart || formatDateForInput(value.start)}
              onChange={(_, data) => setCustomStart(data.value)}
              placeholder="Start date"
            />
            <Text>to</Text>
            <Input
              type="date"
              className={styles.dateInput}
              value={customEnd || formatDateForInput(value.end)}
              onChange={(_, data) => setCustomEnd(data.value)}
              placeholder="End date"
            />
          </div>
          <div className={styles.actions}>
            {hasValue && (
              <Button
                appearance="subtle"
                icon={<DismissRegular />}
                onClick={handleClear}
              >
                Clear
              </Button>
            )}
            <Button
              appearance="primary"
              onClick={handleCustomApply}
              disabled={!customStart && !customEnd}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverSurface>
    </Popover>
  );
};

export default DateRangePicker;
