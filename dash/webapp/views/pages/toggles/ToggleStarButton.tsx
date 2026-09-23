import { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { tokens } from '@weco/dash/views/themes/tokens';

import { MAX_STARRED_TOGGLES } from './toggles.helpers';

const IconButton = styled.button<{ $starred: boolean; $disabled: boolean }>`
  background: none;
  border: none;
  padding: 2px 4px;
  cursor: ${props => (props.$disabled ? 'not-allowed' : 'pointer')};
  display: inline-flex;
  align-items: center;
  color: ${props =>
    props.$starred
      ? tokens.colors.warning.main
      : props.$disabled
        ? tokens.colors.text.disabled
        : tokens.colors.text.secondary};
  border-radius: ${tokens.borderRadius.small};
  position: relative;
  line-height: 1;

  &:hover {
    background: ${props => (props.$disabled ? 'none' : tokens.colors.warning.light)};
  }

  &:focus-visible {
    outline: ${tokens.focus.outline};
    box-shadow: ${tokens.focus.boxShadow};
  }
`;

const CountBadge = styled.span`
  position: absolute;
  bottom: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  pointer-events: none;
  white-space: nowrap;
  font-size: ${tokens.typography.fontSize.small};
  color: ${tokens.colors.warning.text};
  background: ${tokens.colors.warning.light};
  padding: 2px 6px;
  border-radius: 10px;
  animation: fade-in-out 2s ease forwards;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  @keyframes fade-in-out {
    0% {
      opacity: 0;
    }

    10% {
      opacity: 1;
    }

    80% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }
`;

type ToggleStarButtonProps = {
  toggleId: string;
  title: string;
  starredIds: string[];
  onToggle: (id: string) => void;
};

const ToggleStarButton: FunctionComponent<ToggleStarButtonProps> = ({
  toggleId,
  title,
  starredIds,
  onToggle,
}) => {
  const isStarred = starredIds.includes(toggleId);
  const atCap = starredIds.length >= MAX_STARRED_TOGGLES;
  const disabled = !isStarred && atCap;

  const [justChangedCount, setJustChangedCount] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClick = () => {
    const newCount = isStarred ? starredIds.length - 1 : starredIds.length + 1;
    onToggle(toggleId);
    setJustChangedCount(newCount);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setJustChangedCount(null), 2000);
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <IconButton
        type="button"
        $starred={isStarred}
        $disabled={disabled}
        disabled={disabled}
        aria-pressed={isStarred}
        aria-label={
          isStarred
            ? `Remove ${title} from the on-site toggle widget`
            : `Add ${title} to the on-site toggle widget`
        }
        title={
          disabled
            ? `You can only pick ${MAX_STARRED_TOGGLES} toggles for the widget - remove one first`
            : isStarred
              ? 'Shown in the on-site toggle widget'
              : 'Show in the on-site toggle widget'
        }
        onClick={handleClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={isStarred ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </IconButton>
      <span role="status" aria-live="polite">
        {justChangedCount !== null && (
          <CountBadge>
            {justChangedCount}/{MAX_STARRED_TOGGLES} starred
          </CountBadge>
        )}
      </span>
    </span>
  );
};

export default ToggleStarButton;
