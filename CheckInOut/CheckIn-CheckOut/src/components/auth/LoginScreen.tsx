import React from 'react';
import {
  Button,
  Spinner,
  Text,
  makeStyles,
  tokens,
  Card,
  Avatar,
} from '@fluentui/react-components';
import { PersonRegular, ShieldCheckmarkRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    boxShadow: tokens.shadow16,
  },
  header: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    alignItems: 'center',
  },
  title: {
    fontSize: tokens.fontSizeHero800,
    fontWeight: tokens.fontWeightSemibold,
    color: tokens.colorBrandForeground1,
    margin: 0,
  },
  subtitle: {
    fontSize: tokens.fontSizeBase300,
    color: tokens.colorNeutralForeground3,
    margin: 0,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    alignItems: 'center',
  },
  avatar: {
    width: '80px',
    height: '80px',
  },
  button: {
    width: '100%',
    minHeight: '48px',
  },
  errorText: {
    color: tokens.colorPaletteRedForeground1,
    textAlign: 'center',
    fontSize: tokens.fontSizeBase300,
  },
  infoText: {
    textAlign: 'center',
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '8px',
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground2,
  },
});

interface LoginScreenProps {
  onLogin: () => void;
  isLoading: boolean;
  error: string | null;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  isLoading,
  error,
}) => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <Avatar
            className={styles.avatar}
            icon={<ShieldCheckmarkRegular />}
            color="brand"
            size={72}
          />
          <h1 className={styles.title}>Time Registration</h1>
          <p className={styles.subtitle}>Check In & Check Out System</p>
        </div>

        <div className={styles.content}>
          {error && (
            <Text className={styles.errorText}>
              {error}
            </Text>
          )}

          <Button
            appearance="primary"
            size="large"
            className={styles.button}
            onClick={onLogin}
            disabled={isLoading}
            icon={isLoading ? <Spinner size="tiny" /> : <PersonRegular />}
          >
            {isLoading ? 'Signing in...' : 'Sign in with Office 365'}
          </Button>

          <div className={styles.features}>
            <div className={styles.feature}>
              <ShieldCheckmarkRegular />
              <Text>Secure authentication with your Office 365 account</Text>
            </div>
            <div className={styles.feature}>
              <PersonRegular />
              <Text>Automatic employee profile sync</Text>
            </div>
          </div>

          <Text className={styles.infoText}>
            Your credentials are managed securely by Microsoft Office 365.
            This app does not store your password.
          </Text>
        </div>
      </Card>
    </div>
  );
};
