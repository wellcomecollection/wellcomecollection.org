import styled, { css, DefaultTheme } from 'styled-components';

import { classNames, typography } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import {
  BrandButtonColors,
  brandButtonColors,
  designSystemColor,
} from '@weco/common/views/themes/config';

import {
  ButtonColors,
  ButtonHierarchy,
  ButtonSize,
  SolidButtonStyledProps,
} from './Buttons.types';

export const BaseButtonInner = styled.span.attrs<{
  $isInline?: boolean;
  $isPill?: boolean;
  $isNewSearchBar?: boolean;
}>(props => ({
  className: !props.$isInline
    ? props.$isPill
      ? typography('body', 'sm', 'strong')
      : props.$isNewSearchBar
        ? typography('body', 'lg', 'strong')
        : typography('body', 'md', 'strong')
    : props.$isPill
      ? typography('body', 'sm', 'regular')
      : props.$isNewSearchBar
        ? typography('body', 'lg', 'regular')
        : typography('body', 'md', 'regular'),
}))`
  display: flex;
  align-items: center;
  height: 1em;

  /* We need to do .{class}.{class} to override any line-height set by the typography utility */
  && {
    line-height: 1;
  }
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
  if (isNewSearchBar) return '13px 16px';

  switch (size) {
    case 'small':
      return '8px 12px';
    case 'medium':
    default:
      return '13px 20px';
  }
};

/** The brand colours for a button, or undefined if it should keep its preset
 * colours: the toggle is off, it's a pill (styled separately), or its colours
 * have no place in the hierarchy (e.g. `danger`).
 */
export const getBrandButtonColors = ({
  theme,
  colors,
  hierarchy,
  isOnDark,
  isPill,
}: {
  theme: DefaultTheme;
  colors?: ButtonColors;
  hierarchy?: ButtonHierarchy;
  isOnDark?: boolean;
  isPill?: boolean;
}): BrandButtonColors | undefined => {
  if (!theme.brandUpdate || isPill) return undefined;

  const presetColors = colors || theme.buttonColors.default;
  const level = hierarchy || presetColors.hierarchy;
  if (!level) return undefined;

  const onDark = isOnDark ?? presetColors.isOnDark;
  return brandButtonColors[
    level === 'tertiary' && onDark ? 'tertiaryOnDark' : level
  ];
};

// A dark ring with a light gap, which reads on both light and dark backgrounds
export const brandButtonFocusStyle = css`
  outline: 2px solid ${designSystemColor('neutral.70')};
  outline-offset: 2px;
  box-shadow: 0 0 0 2px ${designSystemColor('neutral.05')};
`;

const brandButtonStyles = (colors: BrandButtonColors) => `
  background: ${designSystemColor(colors.default.background)};
  color: ${designSystemColor(colors.default.text)};
  border: 2px solid ${designSystemColor(colors.default.border)};

  &:not([disabled]):hover {
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 0.2em;
  }

  &:not([disabled]):active,
  &[aria-expanded='true']:not([disabled]) {
    background: ${designSystemColor(colors.active.background)};
    color: ${designSystemColor(colors.active.text)};
    border-color: ${designSystemColor(colors.active.border)};
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 0.2em;
  }

  &[disabled],
  &.disabled {
    background: ${designSystemColor(colors.disabled.background)};
    color: ${designSystemColor(colors.disabled.text)};
    border-color: ${designSystemColor(colors.disabled.border)};
  }
`;

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

        ${
          props.theme.brandUpdate
            ? `
              background: transparent;

              &:not([disabled]):hover {
                background: ${props.theme.color({ brand: 'neutral.10', legacy: 'white' })};
                text-decoration: underline;
              }

              /* An open dropdown */
              &[aria-expanded='true']:not([disabled]) {
                background: ${props.theme.color('black')};
                color: ${props.theme.color({ brand: 'neutral.10', legacy: 'white' })};
              }
            `
            : `
              &:not([disabled]):hover {
                box-shadow: ${props.theme.focusBoxShadow};
              }
            `
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

  ${props => {
    const brandColors = getBrandButtonColors({
      theme: props.theme,
      colors: props.$colors,
      hierarchy: props.$hierarchy,
      isOnDark: props.$isOnDark,
      isPill: props.$isPill,
    });

    return (
      brandColors &&
      css`
        ${brandButtonStyles(brandColors)}

        &:focus-visible {
          ${brandButtonFocusStyle}
        }
      `
    );
  }}
`;

export const StyledButton = styled(BasicButton).attrs<SolidButtonStyledProps>(
  props => ({
    'aria-label': props.$ariaLabel,
    className: classNames({ 'link-reset': !!props.href }),
  })
)<SolidButtonStyledProps>`
  ${StyledButtonCSS}
`;
