import { FunctionComponent, SyntheticEvent } from 'react';
import NextLink, { LinkProps } from 'next/link';
import { classNames } from '@weco/common/utils/classnames';
import {
  BaseButtonInner,
  ButtonIconWrapper,
  SolidButton,
  ButtonSolidBaseProps,
} from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { trackGaEvent } from '@weco/common/utils/ga';
import Icon from '@weco/common/views/components/Icon/Icon';
import ConditionalWrapper from '../ConditionalWrapper/ConditionalWrapper';

type ButtonSolidLinkProps = ButtonSolidBaseProps & {
  clickHandler?: (event: SyntheticEvent<HTMLButtonElement>) => void;
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
  dataGtmTrigger,
  size,
  ariaLabel,
  colors,
  isIconAfter,
}) => {
  function handleClick(event: SyntheticEvent<HTMLButtonElement>): void {
    clickHandler && clickHandler(event);
    trackingEvent && trackGaEvent(trackingEvent);
  }

  const isNextLink = typeof link === 'object';

  return (
    <ConditionalWrapper
      condition={isNextLink}
      wrapper={children =>
        typeof link === 'object' && (
          <NextLink {...link} passHref legacyBehavior>
            {children}
          </NextLink>
        )
      }
    >
      <SolidButton
        aria-controls={ariaControls}
        aria-expanded={ariaExpanded}
        data-gtm-trigger={dataGtmTrigger}
        onClick={handleClick}
        href={getHref(link)}
        ariaLabel={ariaLabel}
        $size={size}
        $colors={colors}
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
            <ButtonIconWrapper $iconAfter={isIconAfter}>
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
