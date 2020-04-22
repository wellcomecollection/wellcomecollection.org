// @flow
// import { classNames } from '@weco/common/utils/classnames';
import { trackEvent } from '@weco/common/utils/ga';
import styled from 'styled-components';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';

// flex flex--v-center flex--h-center
export const BaseButton = styled.button`
  line-height: 1.5;
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

  .icon {
    display: inline-block;
    vertical-align: middle;
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

const SolidButton = styled(BaseButton)`
  border: 2px solid ${props => props.theme.colors.green};
  background: ${props => props.theme.colors.green};
  color: ${props => props.theme.colors.white};

  &:not([disabled]):hover,
  &:not([disabled]):focus {
    border-color: ${props => props.theme.colors.black};
    background: ${props => props.theme.colors.black};
  }
`;

// TODO move styles here - styled component
type ButtonProps = {|
  text: string,
  icon?: string,
  size: 'large' | 'small',
  trackingEvent?: GaEvent,
  disabled?: boolean,
  // id?: string, // TODO still needed?
  // target?: string,// TODO still needed?
  // download?: string, // TODO what's this for?
  // rel?: string, // TODO what's this for?
  ariaControls?: string,
  ariaExpanded?: boolean,
  clickHandler?: (event: Event) => void,
  // ref TODO needed?
|};

// type OriginalButtonProps = {| // TODO for reference while developing
// icon?: string,
// iconPosition?: 'start' | 'end',
// text: string,
// textHidden?: boolean,
// tabIndex?: string,
// externalLink?: string,
// type: 'primary' | 'secondary' | 'tertiary',
// extraClasses?: string,
// className?: string,
// fontFamily?: 'hnl' | 'hnm',
// trackingEvent?: GaEvent,
// id?: string,
// disabled?: boolean,
// target?: string,
// download?: string,
// rel?: string,
// ariaControls?: string,
// ariaExpanded?: boolean,
// clickHandler?: (event: Event) => void,
// link?: NextLinkType,
// |}

// type ButtonExternalLinkProps = {|
//   text: string,
//   icon?: string,
//   size: 'large' | 'small',
//   // externalLink?: string, forButtonSolidLink
//   trackingEvent?: GaEvent,
//   // id?: string, // TODO still needed?
//   // disabled?: boolean,// TODO still needed?
//   // target?: string,// TODO still needed?
//   // download?: string, // TODO what's this for?
//   // rel?: string, // TODO what's this for?
//   ariaControls?: string,
//   ariaExpanded?: boolean,
//   clickHandler?: (event: Event) => void,
//   // link?: NextLinkType, // TODO for link version
//   // ref TODO needed?
// |}

// $FlowFixMe (forwardRef) // TODO still need?
const ButtonSolid = ({
  icon,
  text,
  trackingEvent,
  clickHandler,
  ariaControls,
  ariaExpanded,
  disabled,
}: ButtonProps) => {
  function handleClick(e) {
    if (clickHandler) {
      clickHandler(e);
    }
    if (trackingEvent) {
      trackEvent(trackingEvent);
    }
  }
  return (
    <SolidButton
      aria-controls={ariaControls}
      aria-expanded={ariaExpanded}
      onClick={handleClick}
      disabled={disabled}
    >
      {icon && (
        <Space as="span" h={{ size: 'xs', properties: ['margin-right'] }}>
          <Icon name={icon} />
        </Space>
      )}
      {text}
    </SolidButton>
  );
};

export default ButtonSolid;
