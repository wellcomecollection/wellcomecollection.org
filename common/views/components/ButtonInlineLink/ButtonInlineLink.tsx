import { FunctionComponent, SyntheticEvent, ReactElement } from 'react';
import { BaseButtonInner, ButtonIconWrapper } from '../ButtonSolid/ButtonSolid';
import {
  ButtonInlineBaseProps,
  InlineButton,
} from '../ButtonInline/ButtonInline';
import { trackEvent } from '@weco/common/utils/ga';
import Icon from '../Icon/Icon';
import NextLink from 'next/link';
import ConditionalWrapper from '../ConditionalWrapper/ConditionalWrapper';
import convertUrlToString from '../../../utils/convert-url-to-string';
import { LinkProps } from '../../../model/link-props';

type ButtonInlineLinkProps = ButtonInlineBaseProps & {
  clickHandler?: (event: SyntheticEvent<HTMLAnchorElement>) => void;
  link: LinkProps | string;
};

function isStringLink(link: LinkProps | string): link is string {
  return typeof link === 'string';
}

const ButtonInlineLink: FunctionComponent<ButtonInlineLinkProps> = ({
  text,
  link,
  icon,
  trackingEvent,
  clickHandler,
  ariaControls,
  ariaExpanded,
}: ButtonInlineLinkProps): ReactElement<ButtonInlineLinkProps> => {
  function handleClick(event) {
    clickHandler && clickHandler(event);
    trackingEvent && trackEvent(trackingEvent);
  }

  const href: string = isStringLink(link)
    ? link
    : convertUrlToString(link.href);
  return (
    <ConditionalWrapper
      condition={!isStringLink(link)}
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        href={href}
      >
        <BaseButtonInner isInline={true}>
          {text}
          {icon && (
            <ButtonIconWrapper iconAfter={true}>
              <Icon icon={icon} />
            </ButtonIconWrapper>
          )}
        </BaseButtonInner>
      </InlineButton>
    </ConditionalWrapper>
  );
};

export default ButtonInlineLink;
