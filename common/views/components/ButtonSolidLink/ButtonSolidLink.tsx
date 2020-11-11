import { SyntheticEvent } from 'react';
import NextLink, { LinkProps } from 'next/link';
import {
  BaseButtonInner,
  ButtonIconWrapper,
  SolidButton,
  ButtonSolidBaseProps,
} from '../ButtonSolid/ButtonSolid';
import { trackEvent } from '@weco/common/utils/ga';
import Icon from '../Icon/Icon';
import ConditionalWrapper from '../ConditionalWrapper/ConditionalWrapper';

type ButtonSolidLinkProps = ButtonSolidBaseProps & {
  clickHandler?: (event: SyntheticEvent<HTMLAnchorElement>) => void;
  link: LinkProps | string;
};

export function getHref(link: LinkProps | string): undefined | string {
  return typeof link === 'object' ? undefined : link;
}

const ButtonSolidLink = ({
  text,
  link,
  icon,
  trackingEvent,
  clickHandler,
  ariaControls,
  ariaExpanded,
  isBig,
}: ButtonSolidLinkProps): JSX.Element => {
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
        href={getHref(link)}
      >
        <BaseButtonInner>
          {icon && (
            <ButtonIconWrapper>
              <Icon name={icon} />
            </ButtonIconWrapper>
          )}
          {text}
        </BaseButtonInner>
      </SolidButton>
    </ConditionalWrapper>
  );
};

export default ButtonSolidLink;
