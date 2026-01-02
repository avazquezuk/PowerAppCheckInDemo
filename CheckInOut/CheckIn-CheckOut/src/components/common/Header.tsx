import React from 'react';
import {
  makeStyles,
  tokens,
  Text,
  Avatar,
} from '@fluentui/react-components';
import {
  PersonRegular,
  SignOutRegular,
} from '@fluentui/react-icons';
import { Employee } from '@/types';
import { getInitials } from '@/utils';

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
});

interface HeaderProps {
  employee?: Employee | null;
}

const Header: React.FC<HeaderProps> = ({ employee }) => {
  const styles = useStyles();

  return (
    <header className={styles.header}>
      <div className={styles.titleSection}>
        <SignOutRegular fontSize={24} />
        <Text className={styles.title}>Check In / Check Out</Text>
      </div>
      
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
    </header>
  );
};

export default Header;
