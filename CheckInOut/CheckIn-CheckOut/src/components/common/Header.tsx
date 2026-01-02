import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  makeStyles,
  tokens,
  Text,
  Avatar,
  Button,
  Tooltip,
} from '@fluentui/react-components';
import {
  WeatherSunnyRegular,
  WeatherMoonRegular,
  HomeRegular,
  ClockRegular,
  HistoryRegular,
} from '@fluentui/react-icons';
import { Employee } from '@/types';
import { getInitials } from '@/utils';
import { useTheme } from '@/context';

const getPageInfo = (pathname: string): { name: string; icon: React.ReactNode } => {
  switch (pathname) {
    case '/':
      return { name: 'Dashboard', icon: <HomeRegular /> };
    case '/recent':
      return { name: 'Recent Activity', icon: <ClockRegular /> };
    case '/history':
      return { name: 'History', icon: <HistoryRegular /> };
    default:
      return { name: 'Dashboard', icon: <HomeRegular /> };
  }
};

const useStyles = makeStyles({
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalL}`,
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    boxShadow: tokens.shadow4,
  },
  titleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
  title: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  pageIcon: {
    display: 'flex',
    alignItems: 'center',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalS,
  },
  userName: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  userRole: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForegroundOnBrand,
    opacity: 0.8,
  },
  themeButton: {
    color: tokens.colorNeutralForegroundOnBrand,
    minWidth: 'auto',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
});

interface HeaderProps {
  employee?: Employee | null;
}

const Header: React.FC<HeaderProps> = ({ employee }) => {
  const styles = useStyles();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const pageInfo = getPageInfo(location.pathname);

  return (
    <header className={styles.header}>
      <div className={styles.titleSection}>
        <span className={styles.pageIcon}>{pageInfo.icon}</span>
        <Text className={styles.title}>{pageInfo.name}</Text>
      </div>
      
      <div className={styles.rightSection}>
        <Tooltip
          content={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          relationship="label"
        >
          <Button
            appearance="subtle"
            className={styles.themeButton}
            icon={isDark ? <WeatherSunnyRegular /> : <WeatherMoonRegular />}
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          />
        </Tooltip>

        {employee && (
          <div className={styles.userSection}>
            <div style={{ textAlign: 'right' }}>
              <Text className={styles.userName} block>{employee.name}</Text>
              <Text className={styles.userRole}>{employee.department}</Text>
            </div>
            <Avatar
              name={employee.name}
              initials={getInitials(employee.name)}
              size={36}
              color="brand"
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
