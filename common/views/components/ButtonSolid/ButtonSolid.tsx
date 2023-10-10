import {
  forwardRef,
  SyntheticEvent,
  ForwardedRef,
  ReactNode,
  ForwardRefRenderFunction,
} from 'react';
import styled from 'styled-components';

import { classNames, font } from '@weco/common/utils/classnames';
import { trackGaEvent, GaEvent } from '@weco/common/utils/ga';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';
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
  text-decoration: none;
  text-align: center;
  transition:
    background ${props => props.theme.transitionProperties},
    border-color ${props => props.theme.transitionProperties};
  white-space: nowrap;
  cursor: pointer;

  &:focus-visible,
  &:focus {
    box-shadow: ${props => props.theme.focusBoxShadow};
    outline: ${props => props.theme.highContrastOutlineFix};
  }

  :focus:not(:focus-visible) {
    box-shadow: none;
  }

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

type BaseButtonInnerProps = {
  isInline?: boolean;
  isPill?: boolean;
};

const BaseButtonInnerSpan = styled.span<BaseButtonInnerProps>``;
export const BaseButtonInner = styled(
  BaseButtonInnerSpan
).attrs<BaseButtonInnerProps>(props => ({
  className: font(props.isInline ? 'intr' : 'intb', props.isPill ? 6 : 5),
}))`
  display: flex;
  align-items: center;
  height: 1em;
`;

type ButtonIconWrapperAttrsProps = {
  isTextHidden?: boolean;
  iconAfter?: boolean;
  isPill?: boolean;
};
export const ButtonIconWrapper = styled(Space).attrs({
  as: 'span',
})<ButtonIconWrapperAttrsProps>`
  display: inline-flex;
  ${props =>
    !props.isTextHidden &&
    (props.iconAfter ? 'margin-left: 4px;' : 'margin-right: 4px;')}

  /* Prevent icon within .spaced-text parent having top margin */
  margin-top: 0;
`;

export enum ButtonTypes {
  button = 'button',
  reset = 'reset',
  submit = 'submit',
}

type ButtonSize = 'small' | 'medium';

export type ButtonSolidBaseProps = {
  text: ReactNode;
  icon?: IconSvg;
  type?: ButtonTypes;
  isTextHidden?: boolean;
  trackingEvent?: GaEvent;
  ariaControls?: string;
  ariaExpanded?: boolean;
  dataGtmTrigger?: string;
  ariaLive?: 'off' | 'polite' | 'assertive';
  colors?: ButtonColors;
  isIconAfter?: boolean;
  size?: ButtonSize;
  hoverUnderline?: boolean;
  form?: string;
  isPill?: boolean;
};

type ButtonSolidProps = ButtonSolidBaseProps & {
  disabled?: boolean;
  clickHandler?: (event: SyntheticEvent<HTMLButtonElement>) => void;
  isPill?: boolean;
};

type SolidButtonProps = {
  href?: string;
  ariaLabel?: string;
  colors?: ButtonColors;
  size?: ButtonSize;
  hoverUnderline?: boolean;
  isPill?: boolean;
  hasIcon?: boolean;
  isIconAfter?: boolean;
};

// Default to medium button
const getPadding = (size: ButtonSize = 'medium') => {
  switch (size) {
    case 'small':
      return '8px 12px';
    case 'medium':
      return '13px 20px';
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
  padding: ${props => getPadding(props.size)};
  ${props => `
    background:
      ${props.theme.color(
        props?.colors?.background || props.theme.buttonColors.default.background
      )};
    color: ${props.theme.color(
      props?.colors?.text || props.theme.buttonColors.default.text
    )};
  `}

  ${props =>
    props.isPill
      ? `
        border-radius: 20px;
        border: 1px solid ${props.theme.color('black')};
        padding: ${
          props.hasIcon
            ? `8px ${props.isIconAfter ? '8px' : '16px'} 8px ${
                props.isIconAfter ? '16px' : '8px'
              }`
            : '8px 16px'
        };

        &:not([disabled]):hover {
          box-shadow: ${props.theme.focusBoxShadow};
        }

        &:focus {
          outline: ${props => props.theme.highContrastOutlineFix};
        }
      `
      : `

        border: 2px solid
        ${props.theme.color(
          props?.colors?.border || props.theme.buttonColors.default.border
        )};

        &:not([disabled]):hover {
          text-decoration: underline;
        }
      `};
`;

const Button: ForwardRefRenderFunction<HTMLButtonElement, ButtonSolidProps> = (
  {
    icon,
    text,
    type,
    isTextHidden,
    trackingEvent,
    clickHandler,
    ariaControls,
    ariaExpanded,
    dataGtmTrigger,
    ariaLive,
    disabled,
    size,
    colors,
    isIconAfter,
    hoverUnderline,
    form,
    isPill,
  }: ButtonSolidProps,
  ref: ForwardedRef<HTMLButtonElement>
) => {
  function handleClick(event: SyntheticEvent<HTMLButtonElement>) {
    clickHandler && clickHandler(event);
    trackingEvent && trackGaEvent(trackingEvent);
  }

  return (
    <SolidButton
      type={type}
      aria-controls={ariaControls}
      aria-expanded={ariaExpanded}
      data-gtm-trigger={dataGtmTrigger}
      aria-live={ariaLive}
      onClick={handleClick}
      disabled={disabled}
      size={size}
      colors={colors}
      hoverUnderline={hoverUnderline}
      ref={ref}
      form={form}
      isPill={isPill}
      hasIcon={!!icon}
      isIconAfter={isIconAfter}
    >
      <BaseButtonInner isInline={size === 'small'} isPill={isPill}>
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
          <ButtonIconWrapper
            iconAfter={isIconAfter}
            isTextHidden={isTextHidden}
            isPill={isPill}
          >
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

const ButtonSolid = forwardRef<HTMLButtonElement, ButtonSolidProps>(Button);

export default ButtonSolid;
