import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  makeStyles,
  tokens,
  Text,
  Button,
  Tooltip,
  mergeClasses,
} from '@fluentui/react-components';
import {
  HomeRegular,
  HomeFilled,
  ClockRegular,
  ClockFilled,
  HistoryRegular,
  HistoryFilled,
  PersonRegular,
  PersonFilled,
  PanelLeftContractRegular,
  PanelLeftExpandRegular,
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
    transition: 'width 0.2s ease',
  },
  sidebarCollapsed: {
    width: '64px',
  },
  logo: {
    padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalM}`,
    marginBottom: tokens.spacingVerticalM,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '40px',
  },
  logoText: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorBrandForeground1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  logoTextHidden: {
    display: 'none',
  },
  collapseButton: {
    minWidth: 'auto',
    padding: tokens.spacingHorizontalXS,
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
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  menuItemTextHidden: {
    display: 'none',
  },
  menuItemTextActive: {
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
  },
  menuItemCollapsed: {
    justifyContent: 'center',
    padding: tokens.spacingVerticalS,
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
  {
    id: 'profile',
    label: 'My Profile',
    icon: <PersonRegular />,
    iconActive: <PersonFilled />,
    path: '/profile',
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const styles = useStyles();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (item: MenuItem) => location.pathname === item.path;

  const handleClick = (item: MenuItem) => {
    navigate(item.path);
  };

  return (
    <aside className={mergeClasses(styles.sidebar, collapsed && styles.sidebarCollapsed)}>
      <div className={styles.logo}>
        {!collapsed && <Text className={styles.logoText}>Check In/Out</Text>}
        <Tooltip
          content={collapsed ? 'Expand menu' : 'Collapse menu'}
          relationship="label"
          positioning="after"
        >
          <Button
            appearance="subtle"
            className={styles.collapseButton}
            icon={collapsed ? <PanelLeftExpandRegular /> : <PanelLeftContractRegular />}
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}
          />
        </Tooltip>
      </div>

      <nav className={styles.menuList}>
        {menuItems.map(item => {
          const active = isActive(item);
          const button = (
            <button
              key={item.id}
              className={mergeClasses(
                styles.menuItem,
                active && styles.menuItemActive,
                collapsed && styles.menuItemCollapsed
              )}
              onClick={() => handleClick(item)}
            >
              <span className={mergeClasses(styles.menuItemIcon, active && styles.menuItemIconActive)}>
                {active ? item.iconActive : item.icon}
              </span>
              {!collapsed && (
                <Text className={mergeClasses(styles.menuItemText, active && styles.menuItemTextActive)}>
                  {item.label}
                </Text>
              )}
            </button>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.id} content={item.label} relationship="label" positioning="after">
                {button}
              </Tooltip>
            );
          }

          return button;
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
