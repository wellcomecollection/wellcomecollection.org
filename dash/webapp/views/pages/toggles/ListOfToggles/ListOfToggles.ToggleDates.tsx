import { FunctionComponent, ReactNode, useId, useState } from 'react';
import styled from 'styled-components';

import { tokens } from '@weco/dash/views/themes/tokens';

type ToggleDatesProps = {
  dateCreated?: string;
  dateActivated?: string;
  children: ReactNode;
};

const formatDate = (isoString: string): string => {
  // Display first 10 chars (YYYY-MM-DD format)
  return isoString.slice(0, 10);
};

const calculateTimeAgo = (isoString: string): string => {
  const now = new Date();
  const then = new Date(isoString);

  // Guard against invalid dates or unparseable strings
  if (isNaN(then.getTime())) {
    return 'invalid date';
  }

  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Guard against clock skew or future dates
  if (diffDays < 0) {
    return 'invalid date';
  }

  const weeks = Math.round(diffDays / 7);

  if (weeks === 0) return 'less than a week ago';
  return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
};

const Tooltip = styled.div<{ $visible: boolean }>`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background-color: ${tokens.colors.text.primary};
  color: ${tokens.colors.background.default};
  padding: ${tokens.spacing.xs} ${tokens.spacing.sm};
  border-radius: 4px;
  font-size: ${tokens.typography.fontSize.small};
  white-space: normal;
  pointer-events: none;
  opacity: ${props => (props.$visible ? 1 : 0)};
  visibility: ${props => (props.$visible ? 'visible' : 'hidden')};
  transition: opacity 200ms ease;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
  z-index: 10;

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid ${tokens.colors.text.primary};
  }

  div {
    line-height: 1.4;
    white-space: nowrap;
  }
`;

const HeadingWrapper = styled.div`
  position: relative;
  cursor: help;
`;

const ToggleDates: FunctionComponent<ToggleDatesProps> = ({
  dateCreated,
  dateActivated,
  children,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipId = useId();

  if (!dateCreated && !dateActivated) return <>{children}</>;

  return (
    <HeadingWrapper
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocusCapture={() => setShowTooltip(true)}
      onBlurCapture={() => setShowTooltip(false)}
    >
      {children}
      <Tooltip
        id={tooltipId}
        role="tooltip"
        aria-hidden={!showTooltip}
        $visible={showTooltip}
      >
        {dateCreated && (
          <div>
            <strong>Created:</strong> {formatDate(dateCreated)} (
            {calculateTimeAgo(dateCreated)})
          </div>
        )}
        {dateActivated && (
          <div>
            <strong>Activated:</strong> {formatDate(dateActivated)} (
            {calculateTimeAgo(dateActivated)})
          </div>
        )}
      </Tooltip>
    </HeadingWrapper>
  );
};

export default ToggleDates;
