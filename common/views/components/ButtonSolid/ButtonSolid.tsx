import {
  forwardRef,
  SyntheticEvent,
  ForwardedRef,
  FunctionComponent,
  ReactNode,
} from 'react';
import styled from 'styled-components';
import { classNames, font } from '../../../utils/classnames';
import { trackEvent, GaEvent } from '../../../utils/ga';
import Icon from '../Icon/Icon';
import Space from '../styled/Space';
import { IconSvg } from '@weco/common/icons';
import { PaletteColor } from '@weco/common/views/themes/config';
import { hexToRgb } from '@weco/common/utils/convert-colors';

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
    background: ${props => props.theme.color('neutral.600')};
    border-color: ${props => props.theme.color('neutral.600')};
    color: ${props => props.theme.color('white')};
    cursor: not-allowed;

    &:hover {
      text-decoration: none;
    }
  }

  &.disabled {
    pointer-events: none;
  }
`;

type BaseButtonInnerProps = {
  isInline?: boolean;
};

const BaseButtonInnerSpan = styled.span<BaseButtonInnerProps>``;
export const BaseButtonInner = styled(
  BaseButtonInnerSpan
).attrs<BaseButtonInnerProps>(props => ({
  className: font(props.isInline ? 'intr' : 'intb', 5),
}))`
  display: flex;
  align-items: center;
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
}))<ButtonIconWrapperAttrsProps>`
  display: inline-flex;

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
  form?: string;
  isNewStyle?: boolean;
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
  isNewStyle?: boolean;
};

// Default to medium button
const getPadding = (size: ButtonSize = 'medium') => {
  switch (size) {
    case 'small':
      return '8px 12px';
    case 'medium':
      return '13px 20px';
    case 'large':
      return '23px 24px';
  }
};

// TODO phase out the "old style" in favour of the new one:
// Where the hover lightens (or darkens?) the background as Gareth O had wanted
// And has no border color.
// Pass in `isNewStyle` in the meantime to get the newest look.
export const SolidButton = styled(BaseButton).attrs<SolidButtonProps>(
  props => ({
    'aria-label': props.ariaLabel,
    className: classNames({
      'link-reset': !!props.href,
    }),
  })
)<SolidButtonProps>`
  padding: ${({ size }) => getPadding(size)};

  ${props => `
    background: 
      ${props.theme.color(
        props?.colors?.background || props.theme.buttonColors.default.background
      )};
    color: ${props.theme.color(
      props?.colors?.text || props.theme.buttonColors.default.text
    )};
  `}

  ${props => {
    if (props.isNewStyle) {
      const { r, g, b } = hexToRgb(
        props.theme.color(
          props.colors?.background ||
            props.theme.buttonColors.default.background
        )
      );
      return `
      border: 0;

      &:not([disabled]):hover {
        background-color: rgba(${r}, ${g}, ${b}, 0.8);
      }`;
    } else {
      return `
        border: 2px solid
        ${props.theme.color(
          props?.colors?.border || props.theme.buttonColors.default.border
        )};

        &:not([disabled]):hover {
          text-decoration: underline;
        }
      `;
    }
  }}
`;

// TODO move styles here - styled component
const Button: FunctionComponent<ButtonSolidProps> = (
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
    form,
    isNewStyle,
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
      form={form}
      isNewStyle={isNewStyle}
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
