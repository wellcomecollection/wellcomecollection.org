import { forwardRef, SyntheticEvent } from 'react';
import { classNames } from '../../../utils/classnames';
import { GaEvent, trackEvent } from '@weco/common/utils/ga';
import styled from 'styled-components';
import Icon from '../Icon/Icon';
import {
  BaseButton,
  BaseButtonInner,
  ButtonIconWrapper,
} from '../ButtonSolid/ButtonSolid';
import AlignFont from '../styled/AlignFont';

type OutlinedButtonProps = {
  href?: string;
  isOnDark?: boolean;
  isDangerous?: boolean;
};

type ButtonColor = 'white' | 'green' | 'red';

function getColor(
  isOnDark: boolean | undefined,
  isDangerous: boolean | undefined
): ButtonColor {
  if (isOnDark) {
    if (isDangerous) {
      return 'red'; // TODO We don't use this with isOnDark anywhere yet, but it will fail accessibility contrast criteria. Issue #7059
    } else {
      return 'white';
    }
  } else {
    if (isDangerous) {
      return 'red';
    } else {
      return 'green';
    }
  }
}

export const OutlinedButton = styled(BaseButton).attrs<OutlinedButtonProps>(
  props => ({
    className: classNames({
      'link-reset': !!props.href,
    }),
  })
)<OutlinedButtonProps>`
  border: 2px solid
    ${props => props.theme.color(getColor(props.isOnDark, props.isDangerous))};
  background: ${props => props.theme.color('transparent')};
  color: ${props =>
    props.theme.color(getColor(props.isOnDark, props.isDangerous))};

  &:hover {
    text-decoration: underline;
  }
`;

export type ButtonOutlinedBaseProps = {
  text: string;
  icon?: string;
  type?: 'submit' | 'reset' | 'button';
  isTextHidden?: boolean;
  isOnDark?: boolean;
  isDangerous?: boolean;
  trackingEvent?: GaEvent;
  ariaControls?: string;
  ariaExpanded?: boolean;
  ariaLive?: 'off' | 'polite' | 'assertive';
};

type ButtonOutlinedProps = ButtonOutlinedBaseProps & {
  disabled?: boolean;
  clickHandler?: (event: SyntheticEvent<HTMLButtonElement>) => void;
};

const ConditionalWrapper = ({ condition, wrapper, children }) =>
  condition ? wrapper(children) : children;

const ButtonOutlined = forwardRef<HTMLButtonElement, ButtonOutlinedProps>(
  (
    {
      icon,
      text,
      type,
      isTextHidden,
      trackingEvent,
      isOnDark,
      isDangerous,
      clickHandler,
      ariaControls,
      ariaExpanded,
      ariaLive,
      disabled,
    }: ButtonOutlinedProps,
    ref
  ) => {
    function handleClick(event) {
      clickHandler && clickHandler(event);
      trackingEvent && trackEvent(trackingEvent);
    }
    return (
      <OutlinedButton
        type={type}
        isOnDark={isOnDark}
        isDangerous={isDangerous}
        aria-controls={ariaControls}
        aria-expanded={ariaExpanded}
        aria-live={ariaLive}
        onClick={handleClick}
        disabled={disabled}
        ref={ref}
      >
        <BaseButtonInner>
          <>
            <AlignFont
              className={classNames({
                'visually-hidden': !!isTextHidden,
              })}
            >
              {text}
            </AlignFont>
            {icon && (
              <ConditionalWrapper
                condition={!isTextHidden}
                wrapper={children => (
                  <ButtonIconWrapper iconAfter={true}>
                    {children}
                  </ButtonIconWrapper>
                )}
              >
                <Icon name={icon} />
              </ConditionalWrapper>
            )}
          </>
        </BaseButtonInner>
      </OutlinedButton>
    );
  }
);

ButtonOutlined.displayName = 'ButtonOutlined';

export default ButtonOutlined;
