import React, { useState, useMemo } from 'react';
import {
  makeStyles,
  tokens,
  Dropdown,
  Option,
  Input,
  Text,
} from '@fluentui/react-components';
import { SearchRegular, LocationRegular } from '@fluentui/react-icons';
import { Location } from '@/types';
import { filterLocations, sortLocationsByRecent } from '@/utils';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
  },
  label: {
    fontWeight: tokens.fontWeightSemibold,
  },
  searchInput: {
    marginBottom: tokens.spacingVerticalS,
  },
  dropdown: {
    width: '100%',
  },
  optionContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXXS,
  },
  optionName: {
    fontWeight: tokens.fontWeightSemibold,
  },
  optionAddress: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  recentLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorBrandForeground1,
    marginLeft: tokens.spacingHorizontalS,
  },
});

interface LocationSelectorProps {
  locations: Location[];
  selectedLocationId: string | null;
  onSelect: (locationId: string) => void;
  recentLocationIds?: string[];
  disabled?: boolean;
  placeholder?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  locations,
  selectedLocationId,
  onSelect,
  recentLocationIds = [],
  disabled = false,
  placeholder = 'Select a location',
}) => {
  const styles = useStyles();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAndSortedLocations = useMemo(() => {
    let result = filterLocations(locations, searchTerm);
    result = sortLocationsByRecent(result, recentLocationIds);
    return result;
  }, [locations, searchTerm, recentLocationIds]);

  const selectedLocation = locations.find(l => l.id === selectedLocationId);

  return (
    <div className={styles.container}>
      <Text className={styles.label}>
        <LocationRegular /> Work Location
      </Text>
      
      <Input
        className={styles.searchInput}
        placeholder="Search locations..."
        contentBefore={<SearchRegular />}
        value={searchTerm}
        onChange={(_, data) => setSearchTerm(data.value)}
        disabled={disabled}
      />
      
      <Dropdown
        className={styles.dropdown}
        placeholder={placeholder}
        value={selectedLocation?.name || ''}
        selectedOptions={selectedLocationId ? [selectedLocationId] : []}
        onOptionSelect={(_, data) => {
          if (data.optionValue) {
            onSelect(data.optionValue);
          }
        }}
        disabled={disabled}
      >
        {filteredAndSortedLocations.map(location => {
          const isRecent = recentLocationIds.includes(location.id);
          return (
            <Option key={location.id} value={location.id} text={location.name}>
              <div className={styles.optionContent}>
                <span className={styles.optionName}>
                  {location.name}
                  {isRecent && <span className={styles.recentLabel}>(Recent)</span>}
                </span>
                <span className={styles.optionAddress}>{location.address}</span>
              </div>
            </Option>
          );
        })}
      </Dropdown>
    </div>
  );
};

export default LocationSelector;
