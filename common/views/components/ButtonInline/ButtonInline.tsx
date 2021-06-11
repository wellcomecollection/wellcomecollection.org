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

export type ButtonInlineBaseProps = {
  text: string;
  icon?: string;
  type?: ButtonTypes;
  isOnDark?: boolean;
  isTextHidden?: boolean;
  trackingEvent?: GaEvent;
  ariaControls?: string;
  ariaExpanded?: boolean;
  ariaLive?: AriaAttributes['aria-live'];
};

export const InlineButton = styled(BaseButton)<{ isOnDark?: boolean }>`
  border: 2px solid ${props => props.theme.color('pumice')};
  background: ${props => props.theme.color('transparent')};
  color: ${props => props.theme.color(props.isOnDark ? 'white' : 'charcoal')};
  padding: 7px 12px 9px;

  &:hover {
    text-decoration: underline;
  }
`;

type ButtonInlineProps = ButtonInlineBaseProps & {
  disabled?: boolean;
  clickHandler?: (event: SyntheticEvent<HTMLButtonElement>) => void;
};

const ButtonInline = forwardRef<HTMLButtonElement, ButtonInlineProps>(
  (
    {
      icon,
      text,
      type,
      isTextHidden,
      isOnDark,
      trackingEvent,
      clickHandler,
      ariaControls,
      ariaExpanded,
      ariaLive,
      disabled,
    }: ButtonInlineProps,
    ref
  ) => {
    function handleClick(event) {
      clickHandler && clickHandler(event);
      trackingEvent && trackEvent(trackingEvent);
    }
    return (
      <InlineButton
        type={type}
        isOnDark={isOnDark}
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
      </InlineButton>
    );
  }
);

ButtonInline.displayName = 'ButtonInline';

export default ButtonInline;
