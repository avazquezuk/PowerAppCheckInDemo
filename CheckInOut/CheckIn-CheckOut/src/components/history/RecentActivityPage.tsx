import React from 'react';
import {
  makeStyles,
  tokens,
  Card,
  Text,
  Button,
} from '@fluentui/react-components';
import { 
  ClockRegular,
  ArrowRightRegular,
} from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';
import { AppLayout, LoadingSpinner } from '@/components/common';
import { HistoryList } from '@/components/history';
import {
  useEmployee,
  useLocations,
  useHistory,
} from '@/hooks';

const useStyles = makeStyles({
  content: {
    maxWidth: '800px',
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
  card: {
    padding: tokens.spacingVerticalM,
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: tokens.spacingVerticalM,
  },
});

const RecentActivityPage: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();

  const { employee, loading: employeeLoading } = useEmployee();
  const { locations, loading: locationsLoading } = useLocations();
  const { records, loading: historyLoading } = useHistory(employee?.id || null);

  const isLoading = employeeLoading || locationsLoading;

  // Show only recent records (last 7 days or last 10 records)
  const recentRecords = records.slice(0, 10);

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
        <div className={styles.pageHeader}>
          <Text className={styles.pageTitle}>
            <ClockRegular />
            Recent Activity
          </Text>
        </div>

        <Card className={styles.card}>
          <HistoryList
            records={recentRecords}
            locations={locations}
            loading={historyLoading}
            showHeader={false}
          />
        </Card>

        <div className={styles.footer}>
          <Button
            appearance="subtle"
            icon={<ArrowRightRegular />}
            iconPosition="after"
            onClick={() => navigate('/history')}
          >
            View Full History
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default RecentActivityPage;
