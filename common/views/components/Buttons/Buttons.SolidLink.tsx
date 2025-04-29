import NextLink, { LinkProps } from 'next/link';
import { FunctionComponent, SyntheticEvent } from 'react';

import { classNames } from '@weco/common/utils/classnames';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import Icon from '@weco/common/views/components/Icon';

import {
  BaseButtonInner,
  ButtonIconWrapper,
  ButtonSolidBaseProps,
  StyledButton,
} from '.';

export type ButtonSolidLinkProps = ButtonSolidBaseProps & {
  clickHandler?: (event: SyntheticEvent<HTMLButtonElement>) => void;
  link: LinkProps | string;
  ariaLabel?: string;
};

function getHref(link: LinkProps | string): undefined | string {
  return typeof link === 'object' ? undefined : link;
}

const ButtonSolidLink: FunctionComponent<ButtonSolidLinkProps> = ({
  text,
  link,
  icon,
  isTextHidden,
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
      <StyledButton
        aria-controls={ariaControls}
        aria-expanded={ariaExpanded}
        data-gtm-trigger={dataGtmTrigger}
        onClick={handleClick}
        href={getHref(link)}
        $ariaLabel={ariaLabel}
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
      </StyledButton>
    </ConditionalWrapper>
  );
};

export default ButtonSolidLink;
