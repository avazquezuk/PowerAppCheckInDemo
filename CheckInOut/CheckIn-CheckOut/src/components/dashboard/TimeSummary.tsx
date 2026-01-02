import React from 'react';
import {
  makeStyles,
  tokens,
  Card,
  Text,
} from '@fluentui/react-components';
import { TimerRegular } from '@fluentui/react-icons';
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
  emptyState: {
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
    padding: tokens.spacingVerticalL,
  },
});

interface TimeSummaryProps {
  summary: TimeSummaryType | null;
  loading?: boolean;
  title?: string;
}

const TimeSummary: React.FC<TimeSummaryProps> = ({
  summary,
  loading = false,
  title = 'Time Summary',
}) => {
  const styles = useStyles();

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
      </div>

      <div className={styles.totalSection}>
        <Text className={styles.totalValue}>{formatDuration(summary.totalMinutes)}</Text>
        <Text className={styles.totalLabel} block>
          ({formatDurationDecimal(summary.totalMinutes)} hours)
        </Text>
      </div>

      {summary.byLocation.length > 0 && (
        <div className={styles.breakdownSection}>
          <Text className={styles.breakdownTitle}>BY LOCATION</Text>
          <div className={styles.breakdownList}>
            {summary.byLocation.map(item => (
              <div key={item.locationId} className={styles.breakdownItem}>
                <Text className={styles.breakdownName}>{item.locationName}</Text>
                <Text className={styles.breakdownValue}>{formatDuration(item.minutes)}</Text>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default TimeSummary;
