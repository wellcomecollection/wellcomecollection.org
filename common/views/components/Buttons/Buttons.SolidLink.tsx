import NextLink, { LinkProps } from 'next/link';
import { FunctionComponent } from 'react';
import styled, { css, useTheme } from 'styled-components';

import { classNames } from '@weco/common/utils/classnames';
import { dataGtmPropsToAttributes } from '@weco/common/utils/gtm';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import Icon from '@weco/common/views/components/Icon';

import {
  BaseButtonInner,
  brandButtonFocusStyle,
  ButtonIconWrapper,
  ButtonSolidBaseProps,
  getBrandButtonColors,
  StyledButton,
} from '.';

// Focus lands on the link rather than the button inside it
const FocusableLink = styled(NextLink)<{ $hasBrandFocus: boolean }>`
  /* inline-block ensures focus styles wrap entire link */
  display: inline-block;

  ${props =>
    props.$hasBrandFocus &&
    css`
      &:focus-visible {
        ${brandButtonFocusStyle}
      }
    `}
`;

export type ButtonSolidLinkProps = ButtonSolidBaseProps & {
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
  ariaControls,
  ariaExpanded,
  dataGtmProps,
  size,
  ariaLabel,
  colors,
  isIconAfter,
  isPill,
  hierarchy,
  isOnDark,
}) => {
  const theme = useTheme();
  const isNextLink = typeof link === 'object';
  const hasBrandFocus = !!getBrandButtonColors({
    theme,
    colors,
    hierarchy,
    isOnDark,
    isPill,
  });

  return (
    <ConditionalWrapper
      condition={isNextLink}
      wrapper={children =>
        typeof link === 'object' && (
          <FocusableLink {...link} $hasBrandFocus={hasBrandFocus}>
            {children}
          </FocusableLink>
        )
      }
    >
      <StyledButton
        {...dataGtmPropsToAttributes(dataGtmProps)}
        aria-controls={ariaControls}
        aria-expanded={ariaExpanded}
        href={isNextLink ? undefined : getHref(link)}
        $as={isNextLink ? 'span' : undefined}
        $ariaLabel={ariaLabel}
        $size={size}
        $colors={colors}
        $isPill={isPill}
        $hierarchy={hierarchy}
        $isOnDark={isOnDark}
      >
        <BaseButtonInner $isPill={isPill} $isInline={size === 'small'}>
          {isIconAfter && (
            <span className={classNames({ 'visually-hidden': !!isTextHidden })}>
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
