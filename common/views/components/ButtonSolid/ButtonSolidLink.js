import {
  SolidButtonInner,
  ButtonIconWrapper,
  SolidButton,
  type ButtonSolidProps,
} from './ButtonSolid';
import { trackEvent } from '@weco/common/utils/ga';
import Icon from '../Icon/Icon';
import NextLink from 'next/link';
import { type NextLinkType } from '../../../model/next-link-type';

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
  isBig,
}: ButtonSolidLinkProps) => {
  function handleClick(event) {
    clickHandler && clickHandler(event);
    trackingEvent && trackEvent(trackingEvent);
  }
  return (
    <ConditionalWrapper
      condition={link.as || link.href}
      wrapper={children => <NextLink {...link}>{children}</NextLink>}
    >
      <SolidButton
        aria-controls={ariaControls}
        aria-expanded={ariaExpanded}
        onClick={handleClick}
        isBig={isBig}
        href={link.as || link.href ? undefined : link}
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
