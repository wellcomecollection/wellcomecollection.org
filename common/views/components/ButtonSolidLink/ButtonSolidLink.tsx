import { FunctionComponent, ReactElement, SyntheticEvent } from 'react';
import NextLink, { LinkProps } from 'next/link';
import { classNames } from '../../../utils/classnames';
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
  ariaLabel?: string;
};

export function getHref(link: LinkProps | string): undefined | string {
  return typeof link === 'object' ? undefined : link;
}

const ButtonSolidLink: FunctionComponent<ButtonSolidLinkProps> = ({
  text,
  link,
  icon,
  isTextHidden,
  trackingEvent,
  clickHandler,
  ariaControls,
  ariaExpanded,
  isBig,
  ariaLabel,
  colors,
  isIconAfter,
}: ButtonSolidLinkProps): ReactElement<ButtonSolidLinkProps> => {
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
        ariaLabel={ariaLabel}
        colors={colors}
      >
        <BaseButtonInner>
          {isIconAfter && (
            <span
              className={classNames({
                'visually-hidden': !!isTextHidden,
              })}
            >
              {text}
            </span>
          )}
          {icon && (
            <ButtonIconWrapper iconAfter={isIconAfter}>
              <Icon icon={icon} />
            </ButtonIconWrapper>
          )}
          {!isIconAfter && (
            <span
              className={classNames({
                'visually-hidden': !!isTextHidden,
              })}
            >
              {text}
            </span>
          )}
        </BaseButtonInner>
      </SolidButton>
    </ConditionalWrapper>
  );
};

export default ButtonSolidLink;
