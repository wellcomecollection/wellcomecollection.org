import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { tokens } from '@weco/dash/views/themes/tokens';

const BadgeContainer = styled.div<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${tokens.spacing.sm};
  padding: ${tokens.spacing.xs} ${tokens.spacing.sm};
  border-radius: ${tokens.borderRadius.medium};
  background-color: ${props =>
    props.$active
      ? tokens.colors.success.light
      : tokens.colors.background.paper};
  border: 1px solid
    ${props =>
      props.$active ? tokens.colors.success.main : tokens.colors.text.disabled};
  font-size: ${tokens.typography.fontSize.small};
  font-weight: 600;
  color: ${props =>
    props.$active ? tokens.colors.success.text : tokens.colors.text.secondary};
`;

const StatusDot = styled.span<{ $active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: ${tokens.borderRadius.full};
  background-color: ${props =>
    props.$active
      ? tokens.colors.status.active
      : tokens.colors.status.inactive};
  flex-shrink: 0;
`;

type StatusBadgeProps = {
  active: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
};

const StatusBadge: FunctionComponent<StatusBadgeProps> = ({
  active,
  activeLabel = 'On',
  inactiveLabel = 'Off',
}) => {
  return (
    <BadgeContainer
      $active={active}
      role="status"
      aria-label={`Status: ${active ? activeLabel : inactiveLabel}`}
    >
      <StatusDot $active={active} aria-hidden="true" />
      <span>{active ? activeLabel : inactiveLabel}</span>
    </BadgeContainer>
  );
};

export default StatusBadge;
