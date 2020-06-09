// @flow
import {
  SolidButtonInner,
  ButtonIconWrapper,
  SolidButton,
  type ButtonSolidProps,
} from '../ButtonSolid/ButtonSolid';
import { trackEvent } from '@weco/common/utils/ga';
import Icon from '../Icon/Icon';
import NextLink from 'next/link';
import { type NextLinkType } from '../../../model/next-link-type';
import ConditionalWrapper from '../ConditionalWrapper/ConditionalWrapper';

type ButtonSolidLinkProps = {|
  ...ButtonSolidProps,
  link: NextLinkType | string,
|};

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

  const isNextLink = typeof link === 'object';

  return (
    <ConditionalWrapper
      condition={isNextLink}
      wrapper={children =>
        typeof link === 'object' && (
          <NextLink {...link} passHref>
            {children}
          </NextLink>
        )
      }
    >
      <SolidButton
        aria-controls={ariaControls}
        aria-expanded={ariaExpanded}
        onClick={handleClick}
        isBig={isBig}
        href={isNextLink ? undefined : link}
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
