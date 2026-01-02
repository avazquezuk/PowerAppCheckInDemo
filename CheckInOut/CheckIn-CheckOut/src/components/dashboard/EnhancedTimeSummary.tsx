import React, { useState, useMemo } from 'react';
import {
  makeStyles,
  tokens,
  Card,
  Text,
  ToggleButton,
} from '@fluentui/react-components';
import { 
  TimerRegular, 
  CalendarWeekNumbersRegular,
  CalendarMonthRegular,
  ChartMultipleRegular,
} from '@fluentui/react-icons';
import { TimeSummary as TimeSummaryType } from '@/types';
import { formatDuration, formatDurationDecimal } from '@/utils';
import { LoadingSpinner } from '@/components/common';

const useStyles = makeStyles({
  card: {
    padding: tokens.spacingVerticalL,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
    marginBottom: tokens.spacingVerticalM,
  },
  title: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    flex: 1,
  },
  periodSelector: {
    display: 'flex',
    gap: tokens.spacingHorizontalXS,
  },
  totalSection: {
    textAlign: 'center',
    marginBottom: tokens.spacingVerticalL,
  },
  totalValue: {
    fontSize: tokens.fontSizeHero900,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorBrandForeground1,
  },
  totalLabel: {
    color: tokens.colorNeutralForeground3,
    fontSize: tokens.fontSizeBase200,
  },
  chartSection: {
    marginTop: tokens.spacingVerticalM,
    marginBottom: tokens.spacingVerticalM,
  },
  chartTitle: {
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalS,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  chart: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: tokens.spacingHorizontalXS,
    height: '120px',
    padding: `${tokens.spacingVerticalS} 0`,
  },
  barContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
  },
  bar: {
    width: '100%',
    maxWidth: '40px',
    backgroundColor: tokens.colorBrandBackground,
    borderRadius: `${tokens.borderRadiusMedium} ${tokens.borderRadiusMedium} 0 0`,
    transition: 'height 0.3s ease',
    minHeight: '4px',
  },
  barLabel: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
    marginTop: tokens.spacingVerticalXS,
    textAlign: 'center',
  },
  barValue: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground2,
    marginBottom: tokens.spacingVerticalXS,
  },
  barWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  breakdownSection: {
    marginTop: tokens.spacingVerticalM,
  },
  breakdownTitle: {
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalS,
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  breakdownList: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  breakdownItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: tokens.spacingVerticalXS,
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: tokens.borderRadiusMedium,
  },
  breakdownName: {
    fontSize: tokens.fontSizeBase200,
  },
  breakdownValue: {
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase200,
  },
  locationBar: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  locationBarFill: {
    height: '8px',
    backgroundColor: tokens.colorBrandBackground,
    borderRadius: tokens.borderRadiusMedium,
    transition: 'width 0.3s ease',
  },
  emptyState: {
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
    padding: tokens.spacingVerticalL,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: tokens.spacingHorizontalM,
    marginTop: tokens.spacingVerticalM,
    paddingTop: tokens.spacingVerticalM,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  statItem: {
    textAlign: 'center',
  },
  statValue: {
    fontSize: tokens.fontSizeBase400,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
  },
  statLabel: {
    fontSize: tokens.fontSizeBase100,
    color: tokens.colorNeutralForeground3,
  },
});

type Period = 'week' | 'month';

interface EnhancedTimeSummaryProps {
  summary: TimeSummaryType | null;
  loading?: boolean;
  title?: string;
  showPeriodSelector?: boolean;
  onPeriodChange?: (period: Period) => void;
  period?: Period;
  showChart?: boolean;
}

const EnhancedTimeSummary: React.FC<EnhancedTimeSummaryProps> = ({
  summary,
  loading = false,
  title = 'Time Summary',
  showPeriodSelector = false,
  onPeriodChange,
  period = 'week',
  showChart = true,
}) => {
  const styles = useStyles();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>(period);

  const handlePeriodChange = (newPeriod: Period) => {
    setSelectedPeriod(newPeriod);
    onPeriodChange?.(newPeriod);
  };

  // Calculate chart data
  const chartData = useMemo(() => {
    if (!summary?.byDay || summary.byDay.length === 0) return [];
    
    const maxMinutes = Math.max(...summary.byDay.map(d => d.minutes), 1);
    
    return summary.byDay.map(day => ({
      date: day.date,
      minutes: day.minutes,
      height: Math.max((day.minutes / maxMinutes) * 100, day.minutes > 0 ? 5 : 0),
      label: day.date.toLocaleDateString('en-US', { weekday: 'short' }),
      shortLabel: day.date.toLocaleDateString('en-US', { weekday: 'narrow' }),
    }));
  }, [summary?.byDay]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!summary) return null;
    
    const daysWorked = summary.byDay?.filter(d => d.minutes > 0).length || 0;
    const avgMinutesPerDay = daysWorked > 0 ? Math.round(summary.totalMinutes / daysWorked) : 0;
    const locationsUsed = summary.byLocation?.length || 0;
    
    return {
      daysWorked,
      avgHoursPerDay: (avgMinutesPerDay / 60).toFixed(1),
      locationsUsed,
    };
  }, [summary]);

  if (loading) {
    return (
      <Card className={styles.card}>
        <LoadingSpinner label="Loading summary..." size="small" />
      </Card>
    );
  }

  if (!summary || summary.totalMinutes === 0) {
    return (
      <Card className={styles.card}>
        <div className={styles.header}>
          <TimerRegular />
          <Text className={styles.title}>{title}</Text>
          {showPeriodSelector && (
            <div className={styles.periodSelector}>
              <ToggleButton
                size="small"
                checked={selectedPeriod === 'week'}
                onClick={() => handlePeriodChange('week')}
                icon={<CalendarWeekNumbersRegular />}
              >
                Week
              </ToggleButton>
              <ToggleButton
                size="small"
                checked={selectedPeriod === 'month'}
                onClick={() => handlePeriodChange('month')}
                icon={<CalendarMonthRegular />}
              >
                Month
              </ToggleButton>
            </div>
          )}
        </div>
        <div className={styles.emptyState}>
          <Text>No time recorded for this period.</Text>
        </div>
      </Card>
    );
  }

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <TimerRegular />
        <Text className={styles.title}>{title}</Text>
        {showPeriodSelector && (
          <div className={styles.periodSelector}>
            <ToggleButton
              size="small"
              checked={selectedPeriod === 'week'}
              onClick={() => handlePeriodChange('week')}
              icon={<CalendarWeekNumbersRegular />}
            >
              Week
            </ToggleButton>
            <ToggleButton
              size="small"
              checked={selectedPeriod === 'month'}
              onClick={() => handlePeriodChange('month')}
              icon={<CalendarMonthRegular />}
            >
              Month
            </ToggleButton>
          </div>
        )}
      </div>

      <div className={styles.totalSection}>
        <Text className={styles.totalValue}>{formatDuration(summary.totalMinutes)}</Text>
        <Text className={styles.totalLabel} block>
          ({formatDurationDecimal(summary.totalMinutes)} hours)
        </Text>
      </div>

      {/* Daily Chart */}
      {showChart && chartData.length > 0 && (
        <div className={styles.chartSection}>
          <Text className={styles.chartTitle}>
            <ChartMultipleRegular style={{ marginRight: '4px', verticalAlign: 'middle' }} />
            DAILY BREAKDOWN
          </Text>
          <div className={styles.chart}>
            {chartData.map((day, index) => (
              <div key={index} className={styles.barContainer}>
                <div className={styles.barWrapper}>
                  {day.minutes > 0 && (
                    <Text className={styles.barValue}>
                      {(day.minutes / 60).toFixed(1)}h
                    </Text>
                  )}
                  <div
                    className={styles.bar}
                    style={{ 
                      height: `${day.height}%`,
                      opacity: day.minutes === 0 ? 0.3 : 1,
                    }}
                  />
                </div>
                <Text className={styles.barLabel}>{day.shortLabel}</Text>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statistics */}
      {stats && (
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <Text className={styles.statValue}>{stats.daysWorked}</Text>
            <Text className={styles.statLabel} block>Days</Text>
          </div>
          <div className={styles.statItem}>
            <Text className={styles.statValue}>{stats.avgHoursPerDay}h</Text>
            <Text className={styles.statLabel} block>Avg/Day</Text>
          </div>
          <div className={styles.statItem}>
            <Text className={styles.statValue}>{stats.locationsUsed}</Text>
            <Text className={styles.statLabel} block>Locations</Text>
          </div>
        </div>
      )}

      {/* Location Breakdown */}
      {summary.byLocation.length > 0 && (
        <div className={styles.breakdownSection}>
          <Text className={styles.breakdownTitle}>BY LOCATION</Text>
          <div className={styles.breakdownList}>
            {summary.byLocation.map(item => {
              const percentage = Math.round((item.minutes / summary.totalMinutes) * 100);
              return (
                <div key={item.locationId} className={styles.breakdownItem}>
                  <div className={styles.locationBar}>
                    <Text className={styles.breakdownName}>{item.locationName}</Text>
                  </div>
                  <Text className={styles.breakdownValue}>
                    {formatDuration(item.minutes)} ({percentage}%)
                  </Text>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
};

export default EnhancedTimeSummary;
