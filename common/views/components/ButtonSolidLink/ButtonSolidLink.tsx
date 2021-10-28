import { FC, ReactElement, SyntheticEvent } from 'react';
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
import AlignFont from '../styled/AlignFont';

type ButtonSolidLinkProps = ButtonSolidBaseProps & {
  clickHandler?: (event: SyntheticEvent<HTMLAnchorElement>) => void;
  link: LinkProps | string;
  ariaLabel?: string;
};

export function getHref(link: LinkProps | string): undefined | string {
  return typeof link === 'object' ? undefined : link;
}

const ButtonSolidLink: FC<ButtonSolidLinkProps> = ({
  text,
  link,
  icon,
  trackingEvent,
  clickHandler,
  ariaControls,
  ariaExpanded,
  isBig,
  ariaLabel,
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
      >
        <BaseButtonInner>
          {icon && (
            <ButtonIconWrapper>
              <Icon icon={icon} />
            </ButtonIconWrapper>
          )}
          <AlignFont>{text}</AlignFont>
        </BaseButtonInner>
      </SolidButton>
    </ConditionalWrapper>
  );
};

export default ButtonSolidLink;
