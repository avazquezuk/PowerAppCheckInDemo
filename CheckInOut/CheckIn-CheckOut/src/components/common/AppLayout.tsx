import React, { useState, useCallback } from 'react';
import {
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import Sidebar from './Sidebar';
import Header from './Header';
import { Employee } from '@/types';

const SIDEBAR_COLLAPSED_KEY = 'sidebar-collapsed';

const useStyles = makeStyles({
  layout: {
    display: 'flex',
    minHeight: '100vh',
  },
  mainArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  content: {
    flex: 1,
    overflow: 'auto',
  },
});

interface AppLayoutProps {
  children: React.ReactNode;
  employee?: Employee | null;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, employee }) => {
  const styles = useStyles();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    return saved === 'true';
  });

  const handleToggleCollapse = useCallback(() => {
    setSidebarCollapsed(prev => {
      const newValue = !prev;
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(newValue));
      return newValue;
    });
  }, []);

  return (
    <div className={styles.layout}>
      <Sidebar collapsed={sidebarCollapsed} onToggleCollapse={handleToggleCollapse} />
      <div className={styles.mainArea}>
        <Header employee={employee} />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
