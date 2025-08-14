import styled, { css } from 'styled-components';

import { classNames, font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';

import { ButtonSize, SolidButtonStyledProps } from './Buttons.types';

export const BaseButtonInner = styled.span.attrs<{
  $isInline?: boolean;
  $isPill?: boolean;
}>(props => ({
  className: font(props.$isInline ? 'intr' : 'intb', props.$isPill ? 6 : 5),
}))`
  display: flex;
  align-items: center;
  height: 1em;
`;

export const ButtonIconWrapper = styled(Space).attrs({
  as: 'span',
})<{
  $isTextHidden?: boolean;
  $iconAfter?: boolean;
}>`
  display: inline-flex;
  ${props =>
    !props.$isTextHidden &&
    (props.$iconAfter ? 'margin-left: 4px;' : 'margin-right: 4px;')}

  /* Prevent icon within .spaced-text parent having top margin */
  margin-top: 0;
`;

export const BasicButton = styled.button.attrs<{
  href?: string;
}>(props => ({
  as: props.href ? 'a' : 'button',
}))`
  align-items: center;
  display: inline-flex;
  line-height: 1;
  text-decoration: none;
  text-align: center;
  transition:
    background ${props => props.theme.transitionProperties},
    border-color ${props => props.theme.transitionProperties};
  white-space: nowrap;
  cursor: pointer;

  &.disabled {
    pointer-events: none;
  }

  &[disabled],
  &.disabled {
    background: ${props => props.theme.color('neutral.300')};
    border-color: ${props => props.theme.color('neutral.300')};
    color: ${props => props.theme.color('neutral.600')};
    cursor: not-allowed;

    &:hover {
      text-decoration: none;
    }
  }
`;

// Default to medium button
const getPadding = (size: ButtonSize = 'medium') => {
  switch (size) {
    case 'small':
      return '8px 12px';
    case 'medium':
      return '13px 20px';
  }
};

export const StyledButtonCSS = css<SolidButtonStyledProps>`
  padding: ${props => getPadding(props.$size)};
  ${props => `
    background:
      ${props.theme.color(
        props?.$colors?.background ||
          props.theme.buttonColors.default.background
      )};
    color: ${props.theme.color(
      props?.$colors?.text || props.theme.buttonColors.default.text
    )};
  `}

  ${props =>
    props.$isPill
      ? `
        border-radius: 20px;
        border: 1px solid ${props.theme.color('black')};
        padding: ${
          props.$hasIcon
            ? `8px ${props.$isIconAfter ? '8px' : '16px'} 8px ${
                props.$isIconAfter ? '16px' : '8px'
              }`
            : '8px 16px'
        };

        &:not([disabled]):hover {
          box-shadow: ${props.theme.focusBoxShadow};
        }
      `
      : `

        border: 2px solid
        ${props.theme.color(
          props?.$colors?.border || props.theme.buttonColors.default.border
        )};

        &:not([disabled]):hover {
          text-decoration: underline;
        }

        &:focus-visible {
          border: 2px solid ${props.theme.color('black')};
        }
      `};
`;

export const StyledButton = styled(BasicButton).attrs<SolidButtonStyledProps>(
  props => ({
    'aria-label': props.$ariaLabel,
    className: classNames({ 'link-reset': !!props.href }),
  })
)<SolidButtonStyledProps>`
  ${StyledButtonCSS}
`;
