import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  makeStyles,
  tokens,
  Card,
  Text,
} from '@fluentui/react-components';
import {
  ClockRegular,
  ClockFilled,
  HistoryRegular,
  HistoryFilled,
  ChevronRightRegular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    padding: tokens.spacingVerticalM,
  },
  title: {
    fontSize: tokens.fontSizeBase200,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: tokens.spacingVerticalS,
    paddingLeft: tokens.spacingHorizontalS,
  },
  menuList: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalXS,
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: tokens.spacingHorizontalS,
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
  },
  menuItemIconActive: {
    color: tokens.colorBrandForeground1,
  },
  menuItemText: {
    flex: 1,
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground1,
  },
  menuItemTextActive: {
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
  },
  chevron: {
    color: tokens.colorNeutralForeground3,
    fontSize: '16px',
  },
  divider: {
    margin: `${tokens.spacingVerticalS} 0`,
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

interface NavigationMenuProps {
  onNavigate?: (item: MenuItem) => void;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ onNavigate }) => {
  const styles = useStyles();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (item: MenuItem) => {
    return location.pathname === item.path;
  };

  const handleClick = (item: MenuItem) => {
    navigate(item.path);
    onNavigate?.(item);
  };

  return (
    <Card className={styles.container}>
      <Text className={styles.title}>Activity</Text>
      
      <div className={styles.menuList}>
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
              <ChevronRightRegular className={styles.chevron} />
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export default NavigationMenu;
