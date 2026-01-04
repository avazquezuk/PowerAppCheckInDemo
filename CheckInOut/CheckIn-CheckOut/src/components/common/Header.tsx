import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  makeStyles,
  tokens,
  Text,
  Avatar,
  Button,
  Tooltip,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuDivider,
} from '@fluentui/react-components';
import {
  WeatherSunnyRegular,
  WeatherMoonRegular,
  HomeRegular,
  ClockRegular,
  HistoryRegular,
  PersonRegular,
  SignOutRegular,
  SettingsRegular,
} from '@fluentui/react-icons';
import { Employee } from '@/types';
import { getInitials } from '@/utils';
import { useTheme } from '@/context';
import { useUser } from '@/context/UserContext';

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
  const { logout, profile } = useUser();
  const location = useLocation();
  const pageInfo = getPageInfo(location.pathname);

  // Use Office 365 profile if available, otherwise fallback to employee data
  const displayName = profile?.displayName || employee?.name || 'User';
  const displayTitle = profile?.jobTitle || employee?.jobTitle || '';

  const handleSignOut = () => {
    logout();
  };

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
          <Menu>
            <MenuTrigger>
              <div className={styles.userSection} style={{ cursor: 'pointer' }}>
                <div style={{ textAlign: 'right' }}>
                  <Text className={styles.userName} block>{displayName}</Text>
                  <Text className={styles.userRole}>{displayTitle}</Text>
                </div>
                <Avatar
                  name={displayName}
                  initials={getInitials(displayName)}
                  size={36}
                  color="brand"
                />
              </div>
            </MenuTrigger>

            <MenuPopover>
              <MenuList>
                <MenuItem icon={<PersonRegular />}>
                  My Profile
                </MenuItem>
                <MenuItem icon={<SettingsRegular />}>
                  Settings
                </MenuItem>
                <MenuDivider />
                <MenuItem icon={<SignOutRegular />} onClick={handleSignOut}>
                  Sign Out
                </MenuItem>
              </MenuList>
            </MenuPopover>
          </Menu>
        )}
      </div>
    </header>
  );
};

export default Header;
