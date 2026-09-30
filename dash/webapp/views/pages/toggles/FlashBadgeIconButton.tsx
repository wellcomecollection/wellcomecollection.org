import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { tokens } from '@weco/dash/views/themes/tokens';

// Shared by CopyLinkIcon and ToggleStarButton: an icon button that, on
// click, briefly shows a status badge above it (e.g. "Copied!", "3/6
// starred") before it fades out on its own.

export const IconActionWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  position: relative;
`;

export const IconActionButton = styled.button<{
  $color: string;
  $hoverBackground: string;
  $disabled?: boolean;
}>`
  background: none;
  border: none;
  padding: 2px 4px;
  cursor: ${props => (props.$disabled ? 'not-allowed' : 'pointer')};
  display: inline-flex;
  align-items: center;
  color: ${props => props.$color};
  border-radius: ${tokens.borderRadius.small};
  position: relative;
  line-height: 1;

  &:hover {
    background: ${props => (props.$disabled ? 'none' : props.$hoverBackground)};
  }

  &:focus-visible {
    outline: ${tokens.focus.outline};
    box-shadow: ${tokens.focus.boxShadow};
  }
`;

export const FlashBadge = styled.span<{ $color: string; $background: string }>`
  position: absolute;
  bottom: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  pointer-events: none;
  white-space: nowrap;
  font-size: ${tokens.typography.fontSize.small};
  color: ${props => props.$color};
  background: ${props => props.$background};
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

/**
 * Holds a value for 2 seconds after `flash(value)` is called, then clears it
 * - for a badge that announces something happened and fades on its own.
 */
export function useFlashMessage<T>(): [T | null, (value: T) => void] {
  const [message, setMessage] = useState<T | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const flash = (value: T) => {
    setMessage(value);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setMessage(null), 2000);
  };

  return [message, flash];
}
