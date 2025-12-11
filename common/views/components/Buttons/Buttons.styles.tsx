import styled, { css } from 'styled-components';

import { classNames, font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';

import { ButtonSize, SolidButtonStyledProps } from './Buttons.types';

export const BaseButtonInner = styled.span.attrs<{
  $isInline?: boolean;
  $isPill?: boolean;
  $isNewSearchBar?: boolean;
}>(props => ({
  className: !props.$isInline
    ? font('sans-bold', props.$isPill ? -2 : props.$isNewSearchBar ? 0 : -1)
    : font('sans', props.$isPill ? -2 : props.$isNewSearchBar ? 0 : -1),
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
  $as?: 'button' | 'a' | 'span';
}>(props => ({
  as: props.$as || (props.href ? 'a' : 'button'),
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
const getPadding = (size: ButtonSize = 'medium', isNewSearchBar?: boolean) => {
  if (isNewSearchBar) {
    return '13px 16px';
  }
  switch (size) {
    case 'small':
      return '8px 12px';
    case 'medium':
      return '13px 20px';
  }
};

export const StyledButtonCSS = css<SolidButtonStyledProps>`
  padding: ${props => getPadding(props.$size, props.$isNewSearchBar)};
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
