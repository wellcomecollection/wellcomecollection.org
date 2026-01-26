import { FunctionComponent, useState } from 'react';
import styled from 'styled-components';

export const copyEnableLink = async (toggleId: string): Promise<void> => {
  const url = `${window.location.origin}${window.location.pathname}?enableToggle=${encodeURIComponent(
    toggleId
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
  color: #00635b;
  border-radius: 4px;
  position: relative;
  line-height: 1;

  &:hover {
    background: #e0f5f3;
  }

  &:focus-visible {
    outline: 2px solid #009e8c;
    outline-offset: 2px;
  }
`;

const CopiedBadge = styled.span`
  font-size: 11px;
  color: #055d00;
  background: #d9f5d3;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 4px;
  animation: fade-in-out 2s ease forwards;

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

export type CopyLinkIconProps = { toggleId: string; title: string };

const CopyLinkIcon: FunctionComponent<CopyLinkIconProps> = ({
  toggleId,
  title,
}) => {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    await copyEnableLink(toggleId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      <IconButton
        type="button"
        aria-label={`Copy link to enable toggle ${title}`}
        title="Click to copy a link that enables this toggle"
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
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.71" />
        </svg>
      </IconButton>
      {copied && <CopiedBadge>Copied!</CopiedBadge>}
    </span>
  );
};

export default CopyLinkIcon;
