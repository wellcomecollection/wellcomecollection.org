import { forwardRef, SyntheticEvent } from 'react';
import { classNames } from '../../../utils/classnames';
import { GaEvent } from '@weco/common/utils/ga';
import { trackEvent } from '@weco/common/utils/ga';
import styled from 'styled-components';
import Icon from '../Icon/Icon';
import {
  BaseButton,
  BaseButtonInner,
  ButtonIconWrapper,
} from '../ButtonSolid/ButtonSolid';

type MaybeAnchor = {
  href?: string;
};

export const OutlinedButton = styled(BaseButton).attrs<MaybeAnchor>(props => ({
  className: classNames({
    'link-reset': !!props.href,
  }),
}))`
  border: 2px solid
    ${props => props.theme.color(props.isOnDark ? 'white' : 'green')};
  background: ${props => props.theme.color('transparent')};
  color: ${props => props.theme.color(props.isOnDark ? 'white' : 'green')};

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
        aria-controls={ariaControls}
        aria-expanded={ariaExpanded}
        aria-live={ariaLive}
        onClick={handleClick}
        disabled={disabled}
        ref={ref}
      >
        <BaseButtonInner>
          <>
            <span
              className={classNames({
                'visually-hidden': !!isTextHidden,
              })}
            >
              {text}
            </span>
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

export default ButtonOutlined;
