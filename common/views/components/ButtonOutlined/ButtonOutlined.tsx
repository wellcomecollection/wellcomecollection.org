import { forwardRef, SyntheticEvent } from 'react';
import { classNames } from '../../../utils/classnames';
import type { GaEvent } from '@weco/common/utils/ga';
import { trackEvent } from '@weco/common/utils/ga';
import styled from 'styled-components';
import Icon from '../Icon/Icon';
import {
  BaseButton,
  BaseButtonInner,
  ButtonIconWrapper,
} from '../ButtonSolid/ButtonSolid';

export const OutlinedButton = styled(BaseButton).attrs(props => ({
  className: '',
}))`
  border: 2px solid ${props => props.theme.colors.green};
  background: ${props => props.theme.colors.transparent};
  color: ${props => props.theme.colors.green};
  padding: 15px 20px;

  &:hover {
    text-decoration: underline;
  }
`;

export type ButtonOutlinedBaseProps = {
  text: string,
  icon?: string,
  type?: 'submit' | 'reset' | 'button',
  isTextHidden?: boolean,
  trackingEvent?: GaEvent,
  ariaControls?: string,
  ariaExpanded?: boolean,
  ariaLive?: 'off' | 'polite' | 'assertive',
};

type ButtonOutlinedProps = ButtonOutlinedBaseProps & {
  disabled?: boolean,
  clickHandler?: (event: SyntheticEvent<HTMLButtonElement>) => void,
};


const ButtonOutlined = forwardRef<HTMLButtonElement, ButtonOutlinedProps>(
  (
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
        aria-controls={ariaControls}
        aria-expanded={ariaExpanded}
        aria-live={ariaLive}
        onClick={handleClick}
        disabled={disabled}
        ref={ref}>
        <BaseButtonInner>
          <>
            <span
              className={classNames({
                'visually-hidden': !!isTextHidden,
              })}
            >
              {text}
              {icon && (
              <ButtonIconWrapper iconAfter={true}>
                <Icon name={icon} />
              </ButtonIconWrapper>
            )}
            </span>
          </>
        </BaseButtonInner>
      </OutlinedButton>
    );
  }
);

export default ButtonOutlined;
