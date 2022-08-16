import { forwardRef, SyntheticEvent, ForwardedRef, FC } from 'react';
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
  padding: 13px 20px;
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
    [font(props.isInline ? 'hnr' : 'hnb', 5)]: true,
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
}))<ButtonIconWrapperAttrsProps>``;

export enum ButtonTypes {
  button = 'button',
  reset = 'reset',
  submit = 'submit',
}

export type ButtonSolidBaseProps = {
  text: string;
  icon?: IconSvg;
  type?: ButtonTypes;
  isTextHidden?: boolean;
  trackingEvent?: GaEvent;
  isBig?: boolean;
  ariaControls?: string;
  ariaExpanded?: boolean;
  ariaLive?: 'off' | 'polite' | 'assertive';
  colors?: ButtonColors;
  isIconAfter?: boolean;
};

type ButtonSolidProps = ButtonSolidBaseProps & {
  disabled?: boolean;
  clickHandler?: (event: SyntheticEvent<HTMLButtonElement>) => void;
};

type SolidButtonProps = {
  href?: string;
  isBig?: boolean;
  ariaLabel?: string;
  colors?: ButtonColors;
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

  ${props =>
    props.isBig &&
    `
    padding: 14px;
  `}

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
    isBig,
    colors,
    isIconAfter,
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
      isBig={isBig}
      colors={colors}
      ref={ref}
    >
      <BaseButtonInner>
        <>
          {icon && !isIconAfter && (
            <ButtonIconWrapper>
              <Icon icon={icon} />
            </ButtonIconWrapper>
          )}
          <span
            className={classNames({
              'visually-hidden': !!isTextHidden,
            })}
          >
            {text}
          </span>
          {icon && isIconAfter && (
            <ButtonIconWrapper iconAfter>
              <Icon icon={icon} />
            </ButtonIconWrapper>
          )}
        </>
      </BaseButtonInner>
    </SolidButton>
  );
};

const ButtonSolid = forwardRef(Button);

export default ButtonSolid;
