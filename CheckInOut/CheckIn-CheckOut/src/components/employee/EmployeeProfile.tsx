import React from 'react';
import {
  makeStyles,
  tokens,
  Card,
  CardHeader,
  Text,
  Badge,
  Divider,
  Spinner,
} from '@fluentui/react-components';
import {
  PersonRegular,
  MailRegular,
  PhoneRegular,
  BriefcaseRegular,
  BuildingRegular,
  LocationRegular,
  BadgeRegular,
  PersonAccountsRegular,
  ClockRegular,
  TagRegular,
} from '@fluentui/react-icons';
import { AppLayout } from '@/components/common';
import { useEmployee } from '@/hooks';
import { Employee } from '@/types';

const useStyles = makeStyles({
  container: {
    padding: tokens.spacingHorizontalXL,
    maxWidth: '900px',
    margin: '0 auto',
  },
  header: {
    marginBottom: tokens.spacingVerticalXL,
  },
  title: {
    fontSize: tokens.fontSizeHero800,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
    marginBottom: tokens.spacingVerticalS,
  },
  subtitle: {
    fontSize: tokens.fontSizeBase400,
    color: tokens.colorNeutralForeground2,
  },
  card: {
    marginBottom: tokens.spacingVerticalL,
  },
  cardTitle: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground1,
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  section: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: tokens.spacingHorizontalL,
    padding: tokens.spacingVerticalM,
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  fieldLabel: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalXS,
  },
  fieldValue: {
    fontSize: tokens.fontSizeBase400,
    color: tokens.colorNeutralForeground1,
    fontWeight: tokens.fontWeightSemibold,
  },
  fieldValueEmpty: {
    color: tokens.colorNeutralForeground4,
    fontStyle: 'italic',
    fontWeight: tokens.fontWeightRegular,
  },
  statusBadge: {
    marginLeft: tokens.spacingHorizontalM,
  },
  profileHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalL,
    marginBottom: tokens.spacingVerticalL,
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: tokens.colorBrandBackground,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: tokens.fontSizeHero800,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  profileInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: tokens.fontSizeHero900,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForeground1,
    marginBottom: tokens.spacingVerticalXS,
  },
  employeeTitle: {
    fontSize: tokens.fontSizeBase400,
    color: tokens.colorNeutralForeground2,
    marginBottom: tokens.spacingVerticalS,
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
  },
  errorContainer: {
    padding: tokens.spacingVerticalXL,
    textAlign: 'center',
    color: tokens.colorPaletteRedForeground1,
  },
});

interface FieldProps {
  label: string;
  value: string | null | undefined;
  icon?: React.ReactNode;
}

const Field: React.FC<FieldProps> = ({ label, value, icon }) => {
  const styles = useStyles();
  
  return (
    <div className={styles.fieldGroup}>
      <Text className={styles.fieldLabel}>
        {icon}
        {label}
      </Text>
      <Text className={value ? styles.fieldValue : `${styles.fieldValue} ${styles.fieldValueEmpty}`}>
        {value || 'Not specified'}
      </Text>
    </div>
  );
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

const EmployeeProfileContent: React.FC<{ employee: Employee }> = ({ employee }) => {
  const styles = useStyles();
  
  return (
    <div className={styles.container}>
      {/* Profile Header */}
      <Card className={styles.card}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            {getInitials(employee.name)}
          </div>
          <div className={styles.profileInfo}>
            <Text className={styles.employeeName}>{employee.name}</Text>
            <Text className={styles.employeeTitle}>{employee.jobTitle || 'No title'}</Text>
            <Badge
              appearance="filled"
              color={employee.status === 'Active' ? 'success' : 'warning'}
            >
              {employee.status}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Personal Information */}
      <Card className={styles.card}>
        <CardHeader
          header={
            <Text className={styles.cardTitle}>
              <PersonRegular />
              Personal Information
            </Text>
          }
        />
        <Divider />
        <div className={styles.section}>
          <Field 
            label="Employee No." 
            value={employee.id} 
            icon={<BadgeRegular />} 
          />
          <Field 
            label="First Name" 
            value={employee.firstName} 
            icon={<PersonRegular />} 
          />
          <Field 
            label="Last Name" 
            value={employee.lastName} 
            icon={<PersonRegular />} 
          />
          <Field 
            label="Email" 
            value={employee.email} 
            icon={<MailRegular />} 
          />
          <Field 
            label="Mobile Phone" 
            value={employee.mobilePhoneNo} 
            icon={<PhoneRegular />} 
          />
          <Field 
            label="Job Title" 
            value={employee.jobTitle} 
            icon={<BriefcaseRegular />} 
          />
        </div>
      </Card>

      {/* Work Assignment */}
      <Card className={styles.card}>
        <CardHeader
          header={
            <Text className={styles.cardTitle}>
              <BuildingRegular />
              Work Assignment
            </Text>
          }
        />
        <Divider />
        <div className={styles.section}>
          <Field 
            label="Work Location" 
            value={employee.workLocation} 
            icon={<LocationRegular />} 
          />
          <Field 
            label="Work Region" 
            value={employee.workRegion} 
            icon={<BuildingRegular />} 
          />
          <Field 
            label="Work Role" 
            value={employee.workRole} 
            icon={<BriefcaseRegular />} 
          />
        </div>
      </Card>

      {/* System Identifiers */}
      <Card className={styles.card}>
        <CardHeader
          header={
            <Text className={styles.cardTitle}>
              <PersonAccountsRegular />
              System Identifiers
            </Text>
          }
        />
        <Divider />
        <div className={styles.section}>
          <Field 
            label="Retail Staff ID" 
            value={employee.retailStaffId} 
            icon={<BadgeRegular />} 
          />
          <Field 
            label="Retail User ID" 
            value={employee.retailUserId} 
            icon={<PersonAccountsRegular />} 
          />
          <Field 
            label="BC Employee No." 
            value={employee.employeeNo} 
            icon={<TagRegular />} 
          />
          <Field 
            label="Time Entry ID" 
            value={employee.timeEntryId} 
            icon={<ClockRegular />} 
          />
        </div>
      </Card>
    </div>
  );
};

const EmployeeProfile: React.FC = () => {
  const styles = useStyles();
  const { employee, loading, error } = useEmployee();

  return (
    <AppLayout>
      {loading && (
        <div className={styles.loadingContainer}>
          <Spinner size="large" label="Loading employee details..." />
        </div>
      )}
      
      {error && (
        <div className={styles.errorContainer}>
          <Text>Error loading employee details: {error}</Text>
        </div>
      )}
      
      {!loading && !error && employee && (
        <EmployeeProfileContent employee={employee} />
      )}
    </AppLayout>
  );
};

export default EmployeeProfile;
