import { forwardRef, SyntheticEvent, ForwardedRef, FC, ReactNode } from 'react';
import styled from 'styled-components';
import { classNames, font } from '../../../utils/classnames';
import { trackEvent, GaEvent } from '../../../utils/ga';
import Icon from '../Icon/Icon';
import Space from '../styled/Space';
import { IconSvg } from '@weco/common/icons';
import { PaletteColor } from '@weco/common/views/themes/config';

type BaseButtonProps = {
  href?: string;
};

export type ButtonColors = {
  border: PaletteColor;
  background: PaletteColor;
  text: PaletteColor;
};

export const BaseButton = styled.button.attrs<BaseButtonProps>(props => ({
  as: props.href ? 'a' : 'button',
}))`
  align-items: center;
  display: inline-flex;
  line-height: 1;
  border-radius: ${props => `${props.theme.borderRadiusUnit}px`};
  text-decoration: none;
  text-align: center;
  transition: background ${props => props.theme.transitionProperties},
    border-color ${props => props.theme.transitionProperties};
  border: 0;
  white-space: nowrap;
  cursor: pointer;

  &:focus {
    outline: 0;

    .is-keyboard & {
      box-shadow: ${props => props.theme.focusBoxShadow};
    }
  }

  &[disabled],
  &.disabled {
    background: ${props => props.theme.color('pewter')};
    border-color: ${props => props.theme.color('pewter')};
    color: ${props => props.theme.color('white')};
    cursor: not-allowed;

    &:hover {
      text-decoration: none;
    }
  }

  &.disabled {
    pointer-events: none;
  }

  .icon__shape {
    transition: fill ${props => props.theme.transitionProperties};
    fill: currentColor;
  }

  .icon__stroke {
    transition: stroke ${props => props.theme.transitionProperties};
    stroke: currentColor;
  }
`;

type BaseButtonInnerProps = {
  isInline?: boolean;
};

const BaseButtonInnerSpan = styled.span<BaseButtonInnerProps>``;
export const BaseButtonInner = styled(
  BaseButtonInnerSpan
).attrs<BaseButtonInnerProps>(props => ({
  className: classNames({
    [font(props.isInline ? 'intr' : 'intb', 5)]: true,
    'flex flex--v-center': true,
  }),
}))`
  height: 1em;
`;

type ButtonIconWrapperAttrsProps = {
  iconAfter?: boolean;
};
export const ButtonIconWrapper = styled(
  Space
).attrs<ButtonIconWrapperAttrsProps>(props => ({
  as: 'span',
  h: {
    size: 'xs',
    properties: [`${props.iconAfter ? 'margin-left' : 'margin-right'}`],
  },
  className: classNames({
    'flex-inline': true,
  }),
}))<ButtonIconWrapperAttrsProps>`
  // Prevent icon within .spaced-text parent having top margin
  margin-top: 0;
`;

export enum ButtonTypes {
  button = 'button',
  reset = 'reset',
  submit = 'submit',
}

type ButtonSize = 'small' | 'medium' | 'large';

export type ButtonSolidBaseProps = {
  text: ReactNode;
  icon?: IconSvg;
  type?: ButtonTypes;
  isTextHidden?: boolean;
  trackingEvent?: GaEvent;
  ariaControls?: string;
  ariaExpanded?: boolean;
  ariaLive?: 'off' | 'polite' | 'assertive';
  colors?: ButtonColors;
  isIconAfter?: boolean;
  size?: ButtonSize;
  hoverUnderline?: boolean;
};

type ButtonSolidProps = ButtonSolidBaseProps & {
  disabled?: boolean;
  clickHandler?: (event: SyntheticEvent<HTMLButtonElement>) => void;
};

type SolidButtonProps = {
  href?: string;
  ariaLabel?: string;
  colors?: ButtonColors;
  size?: ButtonSize;
  hoverUnderline?: boolean;
};

// Default to medium button
const getPadding = (size: ButtonSize = 'medium') => {
  switch (size) {
    case 'small':
      return '8px 12px';
    case 'medium':
      return '13px 20px';
    case 'large':
      return '14px';
  }
};

export const SolidButton = styled(BaseButton).attrs<SolidButtonProps>(
  props => ({
    'aria-label': props.ariaLabel,
    className: classNames({
      'link-reset': !!props.href,
    }),
  })
)<SolidButtonProps>`
  background: ${props =>
    props.theme.color(
      props?.colors?.background || props.theme.buttonColors.default.background
    )};
  color: ${props =>
    props.theme.color(
      props?.colors?.text || props.theme.buttonColors.default.text
    )};
  border: 2px solid
    ${props =>
      props.theme.color(
        props?.colors?.border || props.theme.buttonColors.default.border
      )};

  padding: ${({ size }) => getPadding(size)};

  &:not([disabled]):hover {
    background: ${props =>
      props.theme.color(
        props?.colors?.background ||
          props.theme.buttonColors.default.background,
        'dark'
      )};
    border-color: ${props =>
      props.theme.color(
        props?.colors?.border || props.theme.buttonColors.default.border,
        'dark'
      )};

    ${props =>
      props?.colors?.background === 'transparent' &&
      `
      text-decoration: underline;
    `};

    ${props =>
      props.hoverUnderline === false &&
      `
      text-decoration: none;
    `}

    ${props =>
      props.hoverUnderline === true &&
      `
      text-decoration: underline;
    `}
  }
`;

// TODO move styles here - styled component
const Button: FC<ButtonSolidProps> = (
  {
    icon,
    text,
    type,
    isTextHidden,
    trackingEvent,
    clickHandler,
    ariaControls,
    ariaExpanded,
    ariaLive,
    disabled,
    size,
    colors,
    isIconAfter,
    hoverUnderline,
  }: ButtonSolidProps,
  ref: ForwardedRef<HTMLButtonElement>
) => {
  function handleClick(event) {
    clickHandler && clickHandler(event);
    trackingEvent && trackEvent(trackingEvent);
  }

  return (
    <SolidButton
      type={type}
      aria-controls={ariaControls}
      aria-expanded={ariaExpanded}
      aria-live={ariaLive}
      onClick={handleClick}
      disabled={disabled}
      size={size}
      colors={colors}
      hoverUnderline={hoverUnderline}
      ref={ref}
    >
      <BaseButtonInner isInline={size === 'small'}>
        {isIconAfter && (
          <span
            className={classNames({
              'visually-hidden': !!isTextHidden,
            })}
          >
            {text}
          </span>
        )}
        {icon && (
          <ButtonIconWrapper iconAfter={isIconAfter}>
            <Icon icon={icon} />
          </ButtonIconWrapper>
        )}
        {!isIconAfter && (
          <span
            className={classNames({
              'visually-hidden': !!isTextHidden,
            })}
          >
            {text}
          </span>
        )}
      </BaseButtonInner>
    </SolidButton>
  );
};

const ButtonSolid = forwardRef(Button);

export default ButtonSolid;
