import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  makeStyles,
  tokens,
  Text,
} from '@fluentui/react-components';
import {
  HomeRegular,
  HomeFilled,
  ClockRegular,
  ClockFilled,
  HistoryRegular,
  HistoryFilled,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  sidebar: {
    width: '240px',
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    flexDirection: 'column',
    padding: tokens.spacingVerticalM,
  },
  logo: {
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalM}`,
    marginBottom: tokens.spacingVerticalM,
  },
  logoText: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorBrandForeground1,
  },
  menuList: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.spacingHorizontalM,
    padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalM}`,
    borderRadius: tokens.borderRadiusMedium,
    cursor: 'pointer',
    transition: 'background-color 0.15s ease',
    border: 'none',
    backgroundColor: 'transparent',
    width: '100%',
    textAlign: 'left',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground3Hover,
    },
  },
  menuItemActive: {
    backgroundColor: tokens.colorBrandBackground2,
    ':hover': {
      backgroundColor: tokens.colorBrandBackground2Hover,
    },
  },
  menuItemIcon: {
    fontSize: '20px',
    color: tokens.colorNeutralForeground2,
    display: 'flex',
    alignItems: 'center',
  },
  menuItemIconActive: {
    color: tokens.colorBrandForeground1,
  },
  menuItemText: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground1,
  },
  menuItemTextActive: {
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
  },
});

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  iconActive: React.ReactNode;
  path: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <HomeRegular />,
    iconActive: <HomeFilled />,
    path: '/',
  },
  {
    id: 'recent',
    label: 'Recent Activity',
    icon: <ClockRegular />,
    iconActive: <ClockFilled />,
    path: '/recent',
  },
  {
    id: 'history',
    label: 'History',
    icon: <HistoryRegular />,
    iconActive: <HistoryFilled />,
    path: '/history',
  },
];

const Sidebar: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (item: MenuItem) => location.pathname === item.path;

  const handleClick = (item: MenuItem) => {
    navigate(item.path);
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <Text className={styles.logoText}>Check In/Out</Text>
      </div>

      <nav className={styles.menuList}>
        {menuItems.map(item => {
          const active = isActive(item);
          return (
            <button
              key={item.id}
              className={`${styles.menuItem} ${active ? styles.menuItemActive : ''}`}
              onClick={() => handleClick(item)}
            >
              <span className={`${styles.menuItemIcon} ${active ? styles.menuItemIconActive : ''}`}>
                {active ? item.iconActive : item.icon}
              </span>
              <Text className={`${styles.menuItemText} ${active ? styles.menuItemTextActive : ''}`}>
                {item.label}
              </Text>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
