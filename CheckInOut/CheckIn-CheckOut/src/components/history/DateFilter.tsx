import React from 'react';
import {
  makeStyles,
  tokens,
  Input,
  Dropdown,
  Option,
  Button,
} from '@fluentui/react-components';
import { FilterRegular, DismissRegular } from '@fluentui/react-icons';
import { Location, HistoryFilters } from '@/types';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalM,
    alignItems: 'flex-end',
    marginBottom: tokens.spacingVerticalM,
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  label: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
  },
  actions: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
  },
});

interface DateFilterProps {
  filters: HistoryFilters;
  locations: Location[];
  onFilterChange: (filters: Partial<HistoryFilters>) => void;
  onClear: () => void;
}

const DateFilter: React.FC<DateFilterProps> = ({
  filters,
  locations,
  onFilterChange,
  onClear,
}) => {
  const styles = useStyles();

  const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const parseInputDate = (value: string): Date | null => {
    if (!value) return null;
    return new Date(value);
  };

  const hasActiveFilters = 
    filters.startDate !== null || 
    filters.endDate !== null || 
    filters.locationId !== null;

  const selectedLocation = locations.find(l => l.id === filters.locationId);

  return (
    <div className={styles.container}>
      <div className={styles.filterGroup}>
        <label className={styles.label}>From Date</label>
        <Input
          type="date"
          value={formatDateForInput(filters.startDate)}
          onChange={(_, data) => onFilterChange({ startDate: parseInputDate(data.value) })}
        />
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.label}>To Date</label>
        <Input
          type="date"
          value={formatDateForInput(filters.endDate)}
          onChange={(_, data) => onFilterChange({ endDate: parseInputDate(data.value) })}
        />
      </div>

      <div className={styles.filterGroup}>
        <label className={styles.label}>Location</label>
        <Dropdown
          placeholder="All locations"
          value={selectedLocation?.name || ''}
          selectedOptions={filters.locationId ? [filters.locationId] : []}
          onOptionSelect={(_, data) => {
            onFilterChange({ locationId: data.optionValue || null });
          }}
          style={{ minWidth: '180px' }}
        >
          <Option value="" text="All locations">All locations</Option>
          {locations.map(location => (
            <Option key={location.id} value={location.id} text={location.name}>
              {location.name}
            </Option>
          ))}
        </Dropdown>
      </div>

      {hasActiveFilters && (
        <div className={styles.actions}>
          <Button
            appearance="subtle"
            icon={<DismissRegular />}
            onClick={onClear}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default DateFilter;
