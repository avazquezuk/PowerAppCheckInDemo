import React from 'react';
import {
  makeStyles,
  tokens,
  Text,
  Avatar,
  Button,
  Tooltip,
} from '@fluentui/react-components';
import {
  PersonRegular,
  SignOutRegular,
  WeatherSunnyRegular,
  WeatherMoonRegular,
} from '@fluentui/react-icons';
import { Employee } from '@/types';
import { getInitials } from '@/utils';
import { useTheme } from '@/context';

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

  return (
    <header className={styles.header}>
      <div className={styles.titleSection}>
        <SignOutRegular fontSize={24} />
        <Text className={styles.title}>Check In / Check Out</Text>
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
