import React from 'react';
import { Badge, BadgeProps } from '@fluentui/react-components';
import { CheckInStatus } from '@/types';

interface StatusBadgeProps {
  status: CheckInStatus;
  size?: BadgeProps['size'];
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'medium' }) => {
  const isCheckedIn = status === 'checked-in';
  
  return (
    <Badge
      appearance="filled"
      color={isCheckedIn ? 'success' : 'warning'}
      size={size}
    >
      {isCheckedIn ? 'Checked In' : 'Checked Out'}
    </Badge>
  );
};

export default StatusBadge;
