import {
  AriaAttributes,
  forwardRef,
  ReactNode,
  SyntheticEvent,
  FC,
} from 'react';
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
import { IconSvg } from '@weco/common/icons';

export type ButtonInlineBaseProps = {
  text: ReactNode;
  icon?: IconSvg;
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
  padding: 8px 12px;

  &:hover {
    text-decoration: underline;
  }
`;

type ButtonInlineProps = ButtonInlineBaseProps & {
  disabled?: boolean;
  clickHandler?: (event: SyntheticEvent<HTMLButtonElement>) => void;
};

const Button: FC<ButtonInlineProps> = (
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
          <span
            className={classNames({
              'visually-hidden': !!isTextHidden,
            })}
          >
            {text}
          </span>
          {icon && (
            <ButtonIconWrapper iconAfter={true}>
              <Icon icon={icon} />
            </ButtonIconWrapper>
          )}
        </>
      </BaseButtonInner>
    </InlineButton>
  );
};

const ButtonInline = forwardRef<HTMLButtonElement, ButtonInlineProps>(Button);

export default ButtonInline;
