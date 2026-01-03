import React, { useState, useMemo } from 'react';
import {
  makeStyles,
  tokens,
  Dropdown,
  Option,
  Button,
  Input,
  Badge,
} from '@fluentui/react-components';
import { 
  LocationRegular, 
  SearchRegular,
  DismissRegular,
} from '@fluentui/react-icons';
import { Location } from '@/types';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  dropdown: {
    minWidth: '200px',
  },
  searchInput: {
    minWidth: '180px',
  },
  badge: {
    marginLeft: tokens.spacingHorizontalXS,
  },
});

interface LocationFilterProps {
  locations: Location[];
  selectedLocationId: string | null;
  onChange: (locationId: string | null) => void;
  showSearch?: boolean;
  placeholder?: string;
}

const LocationFilter: React.FC<LocationFilterProps> = ({
  locations,
  selectedLocationId,
  onChange,
  showSearch = false,
  placeholder = 'All locations',
}) => {
  const styles = useStyles();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLocations = useMemo(() => {
    if (!searchTerm) return locations;
    const term = searchTerm.toLowerCase();
    return locations.filter(
      loc => 
        loc.name.toLowerCase().includes(term) ||
        (loc.workRegion && loc.workRegion.toLowerCase().includes(term))
    );
  }, [locations, searchTerm]);

  const selectedLocation = locations.find(l => l.id === selectedLocationId);
  const activeLocations = locations.filter(l => l.status === 'Active');

  const handleSelect = (_: unknown, data: { optionValue?: string }) => {
    onChange(data.optionValue || null);
  };

  const handleClear = () => {
    onChange(null);
    setSearchTerm('');
  };

  return (
    <div className={styles.container}>
      {showSearch && (
        <Input
          className={styles.searchInput}
          placeholder="Search locations..."
          value={searchTerm}
          onChange={(_, data) => setSearchTerm(data.value)}
          contentBefore={<SearchRegular />}
          contentAfter={
            searchTerm ? (
              <Button
                appearance="subtle"
                size="small"
                icon={<DismissRegular />}
                onClick={() => setSearchTerm('')}
              />
            ) : undefined
          }
        />
      )}
      
      <Dropdown
        className={styles.dropdown}
        placeholder={placeholder}
        value={selectedLocation?.name || ''}
        selectedOptions={selectedLocationId ? [selectedLocationId] : []}
        onOptionSelect={handleSelect}
      >
        <Option value="" text={placeholder}>
          <LocationRegular />
          <span style={{ marginLeft: '8px' }}>{placeholder}</span>
          <Badge className={styles.badge} appearance="tint" size="small">
            {activeLocations.length}
          </Badge>
        </Option>
        {filteredLocations.map(location => (
          <Option
            key={location.id}
            value={location.id}
            text={location.name}
            disabled={location.status !== 'Active'}
          >
            <LocationRegular />
            <span style={{ marginLeft: '8px' }}>{location.name}</span>
          </Option>
        ))}
      </Dropdown>

      {selectedLocationId && (
        <Button
          appearance="subtle"
          size="small"
          icon={<DismissRegular />}
          onClick={handleClear}
          title="Clear filter"
        />
      )}
    </div>
  );
};

export default LocationFilter;
