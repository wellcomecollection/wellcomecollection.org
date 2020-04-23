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
  padding: ${props =>
    `${props.theme.spacingUnit} ${2 * props.theme.spacingUnit}`};

  &:not([disabled]):hover,
  &:not([disabled]):focus {
    cursor: pointer;
  }

  &:focus {
    outline: 0;

    .is-keyboard & {
      box-shadow: ${props => props.theme.focusBoxShadow};
    }
  }

  &[disabled],
  &.disabled {
    background: ${props => props.theme.colors.pewter};
    border-color: ${props => props.theme.colors.pewter};
    cursor: not-allowed;
  }

  &.disabled {
    pointer-events: none;
  }

  .icon__shape {
    transition: fill ${props => props.theme.colors.transitionProperties};
    fill: currentColor;
  }

  .icon__stroke {
    transition: stroke ${props => props.theme.colors.transitionProperties};
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
  border: 2px solid ${props => props.theme.colors.green};
  background: ${props => props.theme.colors.green};
  color: ${props => props.theme.colors.white};
  padding: ${props => (props.big ? '21px 20px' : '15px 20px')};

  &:not([disabled]):hover,
  &:not([disabled]):focus {
    border-color: ${props => props.theme.colors.black};
    background: ${props => props.theme.colors.black};
  }
`;

// TODO move styles here - styled component
export type ButtonSolidProps = {|
  text: string,
  icon?: string,
  trackingEvent?: GaEvent,
  big?: boolean,
  disabled?: boolean,
  ariaControls?: string,
  ariaExpanded?: boolean,
  clickHandler?: (event: Event) => void,
|};

// $FlowFixMe (forwardRef)
const ButtonSolid = forwardRef(
  (
    {
      icon,
      text,
      trackingEvent,
      clickHandler,
      ariaControls,
      ariaExpanded,
      disabled,
      big,
    }: ButtonSolidProps,
    ref
  ) => {
    function handleClick(event) {
      clickHandler && clickHandler(event);
      trackingEvent && trackEvent(trackingEvent);
    }
    return (
      <SolidButton
        aria-controls={ariaControls}
        aria-expanded={ariaExpanded}
        onClick={handleClick}
        disabled={disabled}
        big={big}
        ref={ref}
      >
        <SolidButtonInner>
          {icon && (
            <ButtonIconWrapper>
              <Icon name={icon} />
            </ButtonIconWrapper>
          )}
          {text}
        </SolidButtonInner>
      </SolidButton>
    );
  }
);

export default ButtonSolid;
