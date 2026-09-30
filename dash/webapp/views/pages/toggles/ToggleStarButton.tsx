import { FunctionComponent } from 'react';

import { tokens } from '@weco/dash/views/themes/tokens';

import {
  FlashBadge,
  IconActionButton,
  IconActionWrapper,
  useFlashMessage,
} from './FlashBadgeIconButton';
import { MAX_STARRED_TOGGLES } from './toggles.helpers';
import { useToggleStar } from './ToggleStarContext';

type ToggleStarButtonProps = {
  toggleId: string;
  title: string;
};

const ToggleStarButton: FunctionComponent<ToggleStarButtonProps> = ({
  toggleId,
  title,
}) => {
  const { starredIds, onToggleStar, showStars } = useToggleStar();
  const isStarred = starredIds.includes(toggleId);
  const atCap = starredIds.length >= MAX_STARRED_TOGGLES;
  const disabled = !isStarred && atCap;

  const [justChangedCount, flashCount] = useFlashMessage<number>();

  const handleClick = () => {
    const newCount = isStarred ? starredIds.length - 1 : starredIds.length + 1;
    onToggleStar(toggleId);
    flashCount(newCount);
  };

  if (!showStars) return null;

  return (
    <IconActionWrapper>
      <IconActionButton
        type="button"
        $color={
          isStarred
            ? tokens.colors.warning.main
            : disabled
              ? tokens.colors.text.disabled
              : tokens.colors.text.secondary
        }
        $hoverBackground={tokens.colors.warning.light}
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
      </IconActionButton>
      <span role="status" aria-live="polite">
        {justChangedCount !== null && (
          <FlashBadge
            $color={tokens.colors.warning.text}
            $background={tokens.colors.warning.light}
          >
            {justChangedCount}/{MAX_STARRED_TOGGLES} starred
          </FlashBadge>
        )}
      </span>
    </IconActionWrapper>
  );
};

export default ToggleStarButton;
