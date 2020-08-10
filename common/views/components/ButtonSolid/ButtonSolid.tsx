import { forwardRef, SyntheticEvent } from 'react';
import { classNames, font } from '@weco/common/utils/classnames';
import { trackEvent, GaEvent } from '@weco/common/utils/ga';
import styled from 'styled-components';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';

export const BaseButton = styled.button.attrs(props => ({
  as: props.href ? 'a' : 'button',
  className: classNames({
    'flex-inline flex--v-center': true,
  }),
}))`
  display: inline-flex;
  line-height: 1;
  border-radius: ${props => `${props.theme.borderRadiusUnit}px`};
  text-decoration: none;
  text-align: center;
  transition: all ${props => props.theme.transitionProperties};
  border: 0;
  white-space: nowrap;
  padding: 15px 20px;
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

export const BaseButtonInner = styled.span.attrs({
  className: classNames({
    [font('hnm', 5)]: true,
    'flex flex--v-center': true,
  }),
})`
  height: 1em;
`;

export const ButtonIconWrapper = styled(Space).attrs(props => ({
  as: 'span',
  h: {
    size: 'xs',
    properties: [`${props.iconAfter ? 'margin-left' : 'margin-right'}`],
  },
  className: classNames({
    'flex-inline': true,
  }),
}))``;

export const SolidButton = styled(BaseButton)`
  background: ${props => props.theme.color('green')};
  color: ${props => props.theme.color('white')};

  ${props =>
    props.isBig &&
    `
    padding: 21px 20px 20px;
  `}

  &:not([disabled]):hover {
    background: ${props => props.theme.color('green', 'dark')};
  }
`;

// TODO move styles here - styled component

export type ButtonSolidBaseProps = {
  text: string;
  icon?: string;
  type?: 'submit' | 'reset' | 'button';
  isTextHidden?: boolean;
  trackingEvent?: GaEvent;
  isBig?: boolean;
  ariaControls?: string;
  ariaExpanded?: boolean;
  ariaLive?: 'off' | 'polite' | 'assertive';
};

type ButtonSolidProps = ButtonSolidBaseProps & {
  disabled?: boolean;
  clickHandler?: (event: SyntheticEvent<HTMLButtonElement>) => void,
};

// $FlowFixMe (forwardRef)
const ButtonSolid = forwardRef(
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
      isBig,
    }: ButtonSolidProps,
    ref
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
        ref={ref}
      >
        <BaseButtonInner>
          <>
            {icon && (
              <ButtonIconWrapper>
                <Icon name={icon} />
              </ButtonIconWrapper>
            )}
            <span
              className={classNames({
                'visually-hidden': !!isTextHidden,
              })}
            >
              {text}
            </span>
          </>
        </BaseButtonInner>
      </SolidButton>
    );
  }
);

export default ButtonSolid;
