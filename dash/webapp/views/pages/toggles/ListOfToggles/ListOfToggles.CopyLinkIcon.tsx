import { FunctionComponent } from 'react';

import {
  FlashBadge,
  IconActionButton,
  IconActionWrapper,
  useFlashMessage,
} from '../toggles.FlashBadgeIconButton';

const buildQuery = (props: CopyLinkIconProps): string => {
  if (props.modeValue !== undefined) {
    return `enableMode=${encodeURIComponent(
      props.toggleId
    )}&modeValue=${encodeURIComponent(props.modeValue)}`;
  }
  return `enableToggle=${encodeURIComponent(props.toggleId)}`;
};

const copyLink = async (props: CopyLinkIconProps): Promise<void> => {
  const base = `${window.location.origin}${window.location.pathname}`;
  const url = props.anchor
    ? `${base}#${props.anchor}`
    : `${base}?${buildQuery(props)}`;
  await navigator.clipboard.writeText(url);
};

export type CopyLinkIconProps = {
  toggleId: string;
  title: string;
  modeValue?: string;
  /** Id of the page element to link to, without enabling anything. */
  anchor?: string;
};

const CopyLinkIcon: FunctionComponent<CopyLinkIconProps> = props => {
  const { title, modeValue, anchor } = props;
  const anchorOnly = anchor !== undefined;
  const isMode = modeValue !== undefined;
  const [copied, flashCopied] = useFlashMessage<true>();

  const onCopy = async () => {
    await copyLink(props);
    flashCopied(true);
  };

  return (
    <IconActionWrapper>
      <IconActionButton
        type="button"
        aria-label={
          anchorOnly
            ? `Copy link to ${title}`
            : isMode
              ? `Copy link to set mode ${title}`
              : `Copy link to enable toggle ${title}`
        }
        title={
          anchorOnly
            ? 'Click to copy a link to this toggle'
            : isMode
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
          <g transform={anchorOnly ? undefined : 'scale(0.75)'}>
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.71" />
          </g>
          {!anchorOnly && (
            <polygon
              points="18.5 13 13.5 19 18 19 17.5 23 22.5 17 18 17 18.5 13"
              fill="currentColor"
              strokeWidth="1"
            />
          )}
        </svg>
      </IconActionButton>
      <span role="status" aria-live="polite">
        {copied && <FlashBadge>Copied!</FlashBadge>}
      </span>
    </IconActionWrapper>
  );
};

export default CopyLinkIcon;
