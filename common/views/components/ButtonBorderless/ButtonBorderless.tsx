import { AriaAttributes, forwardRef, SyntheticEvent } from 'react';
import { classNames } from '../../../utils/classnames';
import { GaEvent, trackEvent } from '../../../utils/ga';
import styled from 'styled-components';
import Icon from '../Icon/Icon';
import {
  BaseButton,
  BaseButtonInner,
  ButtonIconWrapper,
  ButtonTypes,
} from '../ButtonSolid/ButtonSolid';
import AlignFont from '../styled/AlignFont';

type ButtonBorderlessProps = {
  text: string;
  isActive?: boolean;
  icon?: string;
  type?: ButtonTypes;
  isTextHidden?: boolean;
  trackingEvent?: GaEvent;
  ariaControls?: string;
  ariaExpanded?: boolean;
  ariaLive?: AriaAttributes['aria-live'];
  disabled?: boolean;
  clickHandler?: (event: SyntheticEvent<HTMLButtonElement>) => void;
};

const BorderlessButton = styled(BaseButton)<{
  isActive?: boolean;
}>`
  background: ${props => props.theme.color('transparent')};
  color: ${props => props.theme.color('charcoal')};
  padding: 10px 8px;

  &:hover {
    background: ${props => props.theme.color('smoke')};
  }

  ${props =>
    props.isActive &&
    `
    background: ${props.theme.color('smoke')};
  `}
`;

const ButtonBorderless = forwardRef<HTMLButtonElement, ButtonBorderlessProps>(
  (
    {
      isActive,
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
    }: ButtonBorderlessProps,
    ref
  ) => {
    function handleClick(event) {
      clickHandler && clickHandler(event);
      trackingEvent && trackEvent(trackingEvent);
    }
    return (
      <BorderlessButton
        isActive={isActive}
        type={type}
        aria-controls={ariaControls}
        aria-expanded={ariaExpanded}
        aria-live={ariaLive}
        onClick={handleClick}
        disabled={disabled}
        ref={ref}
      >
        <BaseButtonInner isInline={true}>
          <>
            <AlignFont
              className={classNames({
                'visually-hidden': !!isTextHidden,
              })}
            >
              {text}
            </AlignFont>
            {icon && (
              <ButtonIconWrapper iconAfter={true}>
                <Icon name={icon} />
              </ButtonIconWrapper>
            )}
          </>
        </BaseButtonInner>
      </BorderlessButton>
    );
  }
);

ButtonBorderless.displayName = 'ButtonBorderless';

export default ButtonBorderless;
