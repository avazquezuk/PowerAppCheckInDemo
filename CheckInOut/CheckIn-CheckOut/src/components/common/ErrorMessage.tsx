import React from 'react';
import {
  makeStyles,
  tokens,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  MessageBarActions,
  Button,
} from '@fluentui/react-components';
import { DismissRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    margin: tokens.spacingVerticalM,
  },
});

interface ErrorMessageProps {
  title?: string;
  message: string;
  onDismiss?: () => void;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Error',
  message,
  onDismiss,
  onRetry,
}) => {
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <MessageBar intent="error">
        <MessageBarBody>
          <MessageBarTitle>{title}</MessageBarTitle>
          {message}
        </MessageBarBody>
        <MessageBarActions>
          {onRetry && (
            <Button appearance="transparent" onClick={onRetry}>
              Retry
            </Button>
          )}
          {onDismiss && (
            <Button
              appearance="transparent"
              icon={<DismissRegular />}
              onClick={onDismiss}
            />
          )}
        </MessageBarActions>
      </MessageBar>
    </div>
  );
};

export default ErrorMessage;
