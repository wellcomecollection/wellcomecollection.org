import { FunctionComponent } from 'react';

import { tokens } from '@weco/dash/views/themes/tokens';

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

const copyEnableLink = async (props: CopyLinkIconProps): Promise<void> => {
  const url = `${window.location.origin}${window.location.pathname}?${buildQuery(
    props
  )}`;
  await navigator.clipboard.writeText(url);
};

export type CopyLinkIconProps = {
  toggleId: string;
  title: string;
  modeValue?: string;
};

const CopyLinkIcon: FunctionComponent<CopyLinkIconProps> = props => {
  const { title, modeValue } = props;
  const isMode = modeValue !== undefined;
  const [copied, flashCopied] = useFlashMessage<true>();

  const onCopy = async () => {
    await copyEnableLink(props);
    flashCopied(true);
  };

  return (
    <IconActionWrapper>
      <IconActionButton
        type="button"
        $color={tokens.colors.success.main}
        $hoverBackground={tokens.colors.success.light}
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
      </IconActionButton>
      <span role="status" aria-live="polite">
        {copied && (
          <FlashBadge
            $color={tokens.colors.success.text}
            $background={tokens.colors.success.light}
          >
            Copied!
          </FlashBadge>
        )}
      </span>
    </IconActionWrapper>
  );
};

export default CopyLinkIcon;
