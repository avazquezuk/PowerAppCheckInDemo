import React, { useState, useMemo, useCallback } from 'react';
import {
  makeStyles,
  tokens,
  Card,
  Text,
  Button,
} from '@fluentui/react-components';
import { 
  HistoryRegular, 
  FilterRegular,
  ArrowDownloadRegular,
} from '@fluentui/react-icons';
import { AppLayout, LoadingSpinner } from '@/components/common';
import { HistoryList, DateRangePicker, LocationFilter } from '@/components/history';
import { EnhancedTimeSummary } from '@/components/dashboard';
import {
  useEmployee,
  useLocations,
  useHistory,
  useTimeSummary,
} from '@/hooks';

const useStyles = makeStyles({
  content: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: tokens.spacingVerticalL,
  },
  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    marginBottom: tokens.spacingVerticalL,
  },
  pageTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    flex: 1,
  },
  filtersCard: {
    padding: tokens.spacingVerticalM,
    marginBottom: tokens.spacingVerticalM,
  },
  filtersHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalM,
  },
  filtersTitle: {
    fontWeight: tokens.fontWeightSemibold,
  },
  filtersRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: tokens.spacingHorizontalM,
    alignItems: 'center',
  },
  filterActions: {
    marginLeft: 'auto',
    display: 'flex',
    gap: tokens.spacingHorizontalS,
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: tokens.spacingHorizontalL,
  },
  historySection: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  summarySection: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalM,
  },
  historyCard: {
    padding: tokens.spacingVerticalM,
  },
  activeFilters: {
    display: 'flex',
    gap: tokens.spacingHorizontalS,
    flexWrap: 'wrap',
    marginTop: tokens.spacingVerticalS,
  },
  exportButton: {
    marginLeft: 'auto',
  },
});

const HistoryPage: React.FC = () => {
  const styles = useStyles();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Data hooks
  const { employee, loading: employeeLoading } = useEmployee();
  const { locations, loading: locationsLoading } = useLocations();
  
  // History with filters
  const {
    records,
    loading: historyLoading,
    filters,
    updateFilters,
    clearFilters,
  } = useHistory(employee?.id || null);

  // Time summary based on filters
  const summaryStartDate = useMemo(() => {
    if (filters.startDate) return filters.startDate;
    // Default to start of current month
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }, [filters.startDate]);

  const summaryEndDate = useMemo(() => {
    if (filters.endDate) return filters.endDate;
    // Default to end of current month
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0);
  }, [filters.endDate]);

  const { summary, loading: summaryLoading } = useTimeSummary(
    employee?.id || null,
    summaryStartDate,
    summaryEndDate,
    filters.locationId
  );

  // Pagination
  const paginatedRecords = useMemo(() => {
    return records.slice(0, page * pageSize);
  }, [records, page, pageSize]);

  const hasMore = paginatedRecords.length < records.length;

  const handleLoadMore = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);

  // Filter handlers
  const handleDateRangeChange = useCallback((range: { start: Date | null; end: Date | null }) => {
    updateFilters({ startDate: range.start, endDate: range.end });
    setPage(1);
  }, [updateFilters]);

  const handleLocationChange = useCallback((locationId: string | null) => {
    updateFilters({ locationId });
    setPage(1);
  }, [updateFilters]);

  const handleClearFilters = useCallback(() => {
    clearFilters();
    setPage(1);
  }, [clearFilters]);

  // Export to CSV
  const handleExport = useCallback(() => {
    if (records.length === 0) return;

    const headers = ['Date', 'Location', 'Check In', 'Check Out', 'Duration (hours)', 'Notes'];
    const rows = records.map(record => {
      const location = locations.find(l => l.id === record.locationId);
      return [
        record.checkInTime.toLocaleDateString(),
        location?.name || 'Unknown',
        record.checkInTime.toLocaleTimeString(),
        record.checkOutTime?.toLocaleTimeString() || 'In Progress',
        record.durationMinutes ? (record.durationMinutes / 60).toFixed(2) : '-',
        record.entryEmployeeComment || '',
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `check-in-history-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }, [records, locations]);

  const hasActiveFilters = filters.startDate || filters.endDate || filters.locationId;
  const isLoading = employeeLoading || locationsLoading;

  // Generate summary title based on active filters
  const summaryTitle = useMemo(() => {
    if (!hasActiveFilters) return 'This Month';
    
    const parts: string[] = [];
    
    // Date range description
    if (filters.startDate && filters.endDate) {
      const startStr = filters.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const endStr = filters.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      parts.push(`${startStr} - ${endStr}`);
    } else if (filters.startDate) {
      const startStr = filters.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      parts.push(`From ${startStr}`);
    } else if (filters.endDate) {
      const endStr = filters.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      parts.push(`Until ${endStr}`);
    } else {
      // No date filter, add default period label
      parts.push('This Month');
    }
    
    // Location description
    if (filters.locationId) {
      const location = locations.find(l => l.id === filters.locationId);
      if (location) {
        parts.push(location.name);
      }
    }
    
    return parts.join(' • ');
  }, [hasActiveFilters, filters.startDate, filters.endDate, filters.locationId, locations]);

  if (isLoading) {
    return (
      <AppLayout>
        <LoadingSpinner label="Loading..." />
      </AppLayout>
    );
  }

  return (
    <AppLayout employee={employee}>
      <div className={styles.content}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <Text className={styles.pageTitle}>
            <HistoryRegular />
            Check-In History
          </Text>
          <Button
            appearance="subtle"
            icon={<ArrowDownloadRegular />}
            onClick={handleExport}
            disabled={records.length === 0}
          >
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card className={styles.filtersCard}>
          <div className={styles.filtersHeader}>
            <FilterRegular />
            <Text className={styles.filtersTitle}>Filters</Text>
            {hasActiveFilters && (
              <Button
                appearance="subtle"
                size="small"
                onClick={handleClearFilters}
              >
                Clear All
              </Button>
            )}
          </div>
          <div className={styles.filtersRow}>
            <DateRangePicker
              value={{ start: filters.startDate, end: filters.endDate }}
              onChange={handleDateRangeChange}
            />
            <LocationFilter
              locations={locations}
              selectedLocationId={filters.locationId}
              onChange={handleLocationChange}
            />
          </div>
        </Card>

        {/* Main Content Grid */}
        <div className={styles.mainGrid}>
          {/* History List */}
          <div className={styles.historySection}>
            <Card className={styles.historyCard}>
              <HistoryList
                records={paginatedRecords}
                locations={locations}
                loading={historyLoading}
                showHeader={true}
                totalCount={records.length}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
              />
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className={styles.summarySection}>
            <EnhancedTimeSummary
              summary={summary}
              loading={summaryLoading}
              title={summaryTitle}
              showChart={true}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default HistoryPage;
