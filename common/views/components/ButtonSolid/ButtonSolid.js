// @flow
import { forwardRef } from 'react';
import { classNames, font } from '@weco/common/utils/classnames';
import { trackEvent, type GaEvent } from '@weco/common/utils/ga';
import styled from 'styled-components';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';

export const BaseButton = styled.button.attrs(props => ({
  as: props.href ? 'a' : 'button',
  className: classNames({
    'flex-inline flex--v-center': true,
  }),
}))`
  line-height: 1;
  border-radius: ${props => `${props.theme.borderRadiusUnit}px`};
  text-decoration: none;
  text-align: center;
  transition: all ${props => props.theme.transitionProperties};
  border: 0;
  white-space: nowrap;
  padding: 15px 20px;

  &:not([disabled]):hover
  }

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
    cursor: not-allowed;
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

export const SolidButtonInner = styled.span.attrs({
  className: classNames({
    [font('hnm', 5)]: true,
    'flex flex--v-center': true,
  }),
})`
  height: 1em;
`;

export const ButtonIconWrapper = styled(Space).attrs({
  as: 'span',
  h: { size: 'xs', properties: ['margin-right'] },
  className: classNames({
    'flex-inline': true,
  }),
})``;

export const SolidButton = styled(BaseButton)`
  background: rgb(${props => props.theme.hexToRgb(props.theme.color('green'))});
  color: ${props => props.theme.color('white')};

  ${props =>
    props.isBig &&
    `
    padding: 21px 20px 20px;
  `}

  &:not([disabled]):hover {
    background: ${props => props.theme.color('greenDarker')};
  }
`;

// TODO move styles here - styled component

export type ButtonSolidBaseProps = {|
  text: string,
  icon?: string,
  type?: 'submit' | 'reset' | 'button',
  isTextHidden?: boolean,
  trackingEvent?: GaEvent,
  isBig?: boolean,
  ariaControls?: string,
  ariaExpanded?: boolean,
  ariaLive?: 'off' | 'polite' | 'assertive',
|};

type ButtonSolidProps = {|
  ...ButtonSolidBaseProps,
  disabled?: boolean,
  clickHandler?: (event: SyntheticEvent<HTMLButtonElement>) => void,
|};

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
        <SolidButtonInner>
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
        </SolidButtonInner>
      </SolidButton>
    );
  }
);

export default ButtonSolid;
