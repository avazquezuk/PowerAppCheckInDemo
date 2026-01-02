import React from 'react';
import { Spinner, SpinnerProps, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacingVerticalXXL,
    gap: tokens.spacingVerticalM,
  },
  label: {
    color: tokens.colorNeutralForeground3,
  },
});

interface LoadingSpinnerProps {
  label?: string;
  size?: SpinnerProps['size'];
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  label = 'Loading...', 
  size = 'medium' 
}) => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <Spinner size={size} label={label} />
    </div>
  );
};

export default LoadingSpinner;
