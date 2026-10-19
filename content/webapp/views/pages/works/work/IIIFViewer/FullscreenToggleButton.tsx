import { FunctionComponent } from 'react';
import styled, { css } from 'styled-components';

import { maximise, minimise } from '@weco/common/icons';
import {
  brandButtonFocusStyle,
  brandButtonStyles,
} from '@weco/common/views/components/Buttons';
import Icon from '@weco/common/views/components/Icon';
import {
  brandButtonColors,
  designSystemColor,
} from '@weco/common/views/themes/config';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';
import useFullscreenToggle from '@weco/content/hooks/useFullscreenToggle';

import { ViewerButton } from './ViewerButton.styles';

// A tertiary button in the brand, the same height as the Downloads button
// beside it (allowing for the 24px icon)
const FullscreenButton = styled(ViewerButton)`
  ${props =>
    props.theme.brandUpdate &&
    css`
      border-radius: 0;
      padding: 4px 12px;
      line-height: 1;
      ${brandButtonStyles(brandButtonColors.tertiaryOnDark)}

      /* Override the dark viewer button's white hover border */
      &:not([disabled]):hover {
        border-color: ${designSystemColor(
          brandButtonColors.tertiaryOnDark.default.border
        )};
      }

      &:focus-visible {
        ${brandButtonFocusStyle}
      }
    `}
`;

type Props = {
  className?: string;
};

const FullscreenToggleButton: FunctionComponent<Props> = ({ className }) => {
  const { viewerRef, isFullscreen, setIsFullscreen } = useItemViewerContext();
  const toggleFullscreen = useFullscreenToggle({ viewerRef, setIsFullscreen });

  return (
    <FullscreenButton className={className} onClick={toggleFullscreen} $isDark>
      {isFullscreen ? (
        <>
          <Icon icon={minimise} />
          <span style={{ marginLeft: '7px' }}>Exit full screen</span>
        </>
      ) : (
        <>
          <Icon icon={maximise} />
          <span style={{ marginLeft: '7px' }}>Full screen</span>
        </>
      )}
    </FullscreenButton>
  );
};

export default FullscreenToggleButton;
