// @flow
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
import type { NextLinkType } from '../../../model/next-link-type';
import ConditionalWrapper from '../ConditionalWrapper/ConditionalWrapper';

type ButtonOutlinedLinkProps = ButtonOutlinedBaseProps & {
  clickHandler?: (event: SyntheticEvent<HTMLAnchorElement>) => void,
  link: NextLinkType | string,
};

const ButtonOutlinedLink = ({
  text,
  link,
  icon,
  trackingEvent,
  clickHandler,
  ariaControls,
  ariaExpanded,
}: ButtonOutlinedLinkProps) => {
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
      <OutlinedButton
        aria-controls={ariaControls}
        aria-expanded={ariaExpanded}
        onClick={handleClick}
        href={isNextLink ? undefined : link}
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
