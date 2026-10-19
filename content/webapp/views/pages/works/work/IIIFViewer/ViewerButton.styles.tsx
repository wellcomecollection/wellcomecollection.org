import styled, { css } from 'styled-components';

import { typography } from '@weco/common/utils/classnames';
import {
  brandButtonFocusStyle,
  brandButtonStyles,
} from '@weco/common/views/components/Buttons';
import { brandButtonColors } from '@weco/common/views/themes/config';

export const ViewerButton = styled.button.attrs({
  className: typography('body', 'md', 'strong'),
})<{ $isDark?: boolean; $isTertiary?: boolean }>`
  line-height: 1.5;
  border-radius: ${props => props.theme.borderRadiusUnit}px;
  text-decoration: none;
  text-align: center;
  white-space: nowrap;
  padding: 6px 12px;
  position: relative;
  display: flex;
  align-items: center;

  &:not([disabled]):hover {
    cursor: pointer;
  }

  &[disabled],
  &.disabled {
    background: ${props => props.theme.color('neutral.600')};
    border-color: ${props => props.theme.color('neutral.600')};
    cursor: not-allowed;
  }

  &.disabled {
    pointer-events: none;
  }

  .icon {
    display: inline-block;
    vertical-align: middle;
  }

  overflow: hidden;

  ${props =>
    props.$isDark &&
    !(props.$isTertiary && props.theme.brandUpdate) &&
    css`
      border: 2px solid transparent;
      color: ${props.theme.color('white')};
      background: transparent;

      &:not([disabled]):hover {
        border: 2px solid ${props.theme.color('white')};
      }
    `}

  ${props =>
    !props.$isDark &&
    css`
      background: ${props.theme.color('white')};
      color: ${props.theme.color('accent.green')};
      border: 1px solid ${props.theme.color('accent.green')};

      &:not([disabled]):hover {
        background: ${props.theme.color('accent.green')};
        color: ${props.theme.color('white')};
      }
    `}
`;

// A dark viewer button that's a tertiary button in the brand (in place of the
// legacy dark styles), the same height as the Downloads button whether or not
// it has an icon
export const TertiaryViewerButton = styled(ViewerButton).attrs({
  $isDark: true,
  $isTertiary: true,
})`
  ${props =>
    props.theme.brandUpdate &&
    css`
      border-radius: 0;
      min-height: 36px;
      padding: 0 12px;
      line-height: 1;
      ${brandButtonStyles(brandButtonColors.tertiaryOnDark)}

      &:focus-visible {
        ${brandButtonFocusStyle}
      }
    `}
`;
