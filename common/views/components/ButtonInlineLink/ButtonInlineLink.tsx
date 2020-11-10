// @flow
import { SyntheticEvent } from 'react';
import { BaseButtonInner, ButtonIconWrapper } from '../ButtonSolid/ButtonSolid';
import {
  ButtonInlineBaseProps,
  InlineButton,
} from '../ButtonInline/ButtonInline';

import { trackEvent } from '@weco/common/utils/ga';
import Icon from '../Icon/Icon';
import NextLink from 'next/link';
import ConditionalWrapper from '../ConditionalWrapper/ConditionalWrapper';

type ButtonInlineLinkProps = ButtonInlineBaseProps & {
  clickHandler?: (event: SyntheticEvent<HTMLAnchorElement>) => void;
  link:
    | {
        href: { pathname: string; query: string };
        as: { pathname: string; query: string };
      }
    | string;
};

const ButtonInlineLink = ({
  text,
  link,
  icon,
  trackingEvent,
  clickHandler,
  ariaControls,
  ariaExpanded,
}: ButtonInlineLinkProps): JSX.Element => {
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
      <InlineButton
        aria-controls={ariaControls}
        aria-expanded={ariaExpanded}
        onClick={handleClick}
        href={isNextLink ? undefined : link}
      >
        <BaseButtonInner isInline={true}>
          {text}
          {icon && (
            <ButtonIconWrapper iconAfter={true}>
              <Icon name={icon} />
            </ButtonIconWrapper>
          )}
        </BaseButtonInner>
      </InlineButton>
    </ConditionalWrapper>
  );
};

export default ButtonInlineLink;
