import { FunctionComponent, ReactElement, SyntheticEvent } from 'react';
import { BaseButtonInner, ButtonIconWrapper } from '../ButtonSolid/ButtonSolid';
import {
  ButtonOutlinedBaseProps,
  OutlinedButton,
} from '../ButtonOutlined/ButtonOutlined';

import { trackEvent } from '@weco/common/utils/ga';
import Icon from '../Icon/Icon';
import NextLink from 'next/link';
import ConditionalWrapper from '../ConditionalWrapper/ConditionalWrapper';
import { getHref } from '../ButtonSolidLink/ButtonSolidLink';
import { LinkProps } from '../../../model/link-props';
import AlignFont from '../styled/AlignFont';

type ButtonOutlinedLinkProps = ButtonOutlinedBaseProps & {
  clickHandler?: (event: SyntheticEvent<HTMLAnchorElement>) => void;
  link: LinkProps | string;
};

const ButtonOutlinedLink: FunctionComponent<ButtonOutlinedLinkProps> = ({
  text,
  link,
  icon,
  trackingEvent,
  clickHandler,
  ariaControls,
  ariaExpanded,
  isOnDark,
}: ButtonOutlinedLinkProps): ReactElement<ButtonOutlinedLinkProps> => {
  function handleClick(event) {
    clickHandler && clickHandler(event);
    trackingEvent && trackEvent(trackingEvent);
  }

  const isNextLink = typeof link === 'object';

  return (
    <ConditionalWrapper
      condition={isNextLink}
      wrapper={(children: ReactElement) =>
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
          <AlignFont>{text}</AlignFont>
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
