import {
  SolidButtonInner,
  ButtonIconWrapper,
  SolidButton,
} from './ButtonSolid';
import { trackEvent } from '@weco/common/utils/ga';
import Icon from '../Icon/Icon';
import NextLink from 'next/link';
import type ButtonSolidProps from './ButtonSolid';
import type NextLinkType from '../../../model/next-link-type';

type ButtonSolidLinkProps = {|
  ...ButtonSolidProps,
  link: NextLinkType | string,
|};

const ConditionalWrapper = ({ condition, wrapper, children }) =>
  condition ? wrapper(children) : children;

const ButtonSolidLink = ({
  text,
  link,
  icon,
  trackingEvent,
  clickHandler,
  ariaControls,
  ariaExpanded,
  disabled,
  big,
}: ButtonSolidLinkProps) => {
  function handleClick(event) {
    clickHandler && clickHandler(event);
    trackingEvent && trackEvent(trackingEvent);
  }
  return (
    <ConditionalWrapper
      condition={link.as}
      wrapper={children => <NextLink {...link}>{children}</NextLink>}
    >
      <SolidButton
        aria-controls={ariaControls}
        aria-expanded={ariaExpanded}
        onClick={handleClick}
        big={big}
        href={link.as ? undefined : link}
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
    </ConditionalWrapper>
  );
};

export default ButtonSolidLink;
