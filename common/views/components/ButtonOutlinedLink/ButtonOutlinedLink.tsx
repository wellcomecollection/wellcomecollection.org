import {SyntheticEvent} from 'react';
import {
  BaseButtonInner,
  ButtonIconWrapper,
} from '../ButtonSolid/ButtonSolid';
import type { ButtonOutlinedBaseProps } from '../ButtonOutlined/ButtonOutlined';
import {
  OutlinedButton,
} from '../ButtonOutlined/ButtonOutlined';
import { trackEvent } from '@weco/common/utils/ga';
import Icon from '../Icon/Icon';
import NextLink from 'next/link';
import ConditionalWrapper from '../ConditionalWrapper/ConditionalWrapper';
import { getHref } from '../ButtonSolidLink/ButtonSolidLink';

type ButtonOutlinedLinkProps = ButtonOutlinedBaseProps & {
  clickHandler?: (event: SyntheticEvent<HTMLAnchorElement>) => void,
  link: {href: {pathname: string, query: string}, as: {pathname: string, query: string}} | string,
};

const ButtonOutlinedLink = ({
  text,
  link,
  icon,
  trackingEvent,
  clickHandler,
  ariaControls,
  ariaExpanded,
  isOnDark
}: ButtonOutlinedLinkProps) => {
  function handleClick(event) {
    clickHandler && clickHandler(event);
    trackingEvent && trackEvent(trackingEvent);
  }

  const isNextLink = typeof link === 'object';

  return (
    <ConditionalWrapper
      condition={isNextLink}
      wrapper={(children: JSX.Element) =>
        typeof link === 'object' && (
          <NextLink {...link} passHref>
            {children}
          </NextLink>
        )
      }
    >
      <OutlinedButton
        aria-controls={ariaControls}
        aria-expanded={ariaExpanded}
        onClick={handleClick}
        isOnDark={isOnDark}
        href={getHref(link)}
      >
        <BaseButtonInner>
          {text}
          {icon && (
            <ButtonIconWrapper iconAfter={true}>
              <Icon name={icon} />
            </ButtonIconWrapper>
          )}
        </BaseButtonInner>
      </OutlinedButton>
    </ConditionalWrapper>
  );
};

export default ButtonOutlinedLink;
