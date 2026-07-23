import { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { tokens } from '@weco/dash/views/themes/tokens';

const buildQuery = (props: CopyLinkIconProps): string => {
  if (props.modeValue !== undefined) {
    return `enableMode=${encodeURIComponent(
      props.toggleId
    )}&modeValue=${encodeURIComponent(props.modeValue)}`;
  }
  return `enableToggle=${encodeURIComponent(props.toggleId)}`;
};

const copyEnableLink = async (props: CopyLinkIconProps): Promise<void> => {
  const url = `${window.location.origin}${window.location.pathname}?${buildQuery(
    props
  )}`;
  await navigator.clipboard.writeText(url);
};

const IconButton = styled.button`
  background: none;
  border: none;
  padding: 2px 4px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  color: ${tokens.colors.success.main};
  border-radius: ${tokens.borderRadius.small};
  position: relative;
  line-height: 1;

  &:hover {
    background: ${tokens.colors.success.light};
  }

  &:focus-visible {
    outline: ${tokens.focus.outline};
    box-shadow: ${tokens.focus.boxShadow};
  }
`;

const CopiedBadge = styled.span`
  position: absolute;
  bottom: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  pointer-events: none;
  white-space: nowrap;
  font-size: ${tokens.typography.fontSize.small};
  color: ${tokens.colors.success.text};
  background: ${tokens.colors.success.light};
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

export type CopyLinkIconProps = { toggleId: string; title: string } & (
  | { modeValue?: undefined }
  | { modeValue: string }
);

const CopyLinkIcon: FunctionComponent<CopyLinkIconProps> = props => {
  const { title, modeValue } = props;
  const [copied, setCopied] = useState(false);
  const isMode = modeValue !== undefined;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const onCopy = async () => {
    await copyEnableLink(props);
    setCopied(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setCopied(false), 2000);
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
        aria-label={
          isMode
            ? `Copy link to set mode ${title}`
            : `Copy link to enable toggle ${title}`
        }
        title={
          isMode
            ? 'Click to copy a link that sets this mode'
            : 'Click to copy a link that enables this toggle'
        }
        onClick={onCopy}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.71" />
        </svg>
      </IconButton>
      <span role="status" aria-live="polite">
        {copied && <CopiedBadge>Copied!</CopiedBadge>}
      </span>
    </span>
  );
};

export default CopyLinkIcon;
