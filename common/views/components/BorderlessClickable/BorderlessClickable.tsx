import { ComponentProps, FC, SyntheticEvent } from 'react';
import styled from 'styled-components';
import {
  BaseButton,
  BaseButtonInner,
  ButtonIconWrapper,
} from '../ButtonSolid/ButtonSolid';
import AlignFont from '../styled/AlignFont';
import Icon from '../Icon/Icon';
import { classNames } from '../../../utils/classnames';
import { GaEvent, trackEvent } from '../../../utils/ga';
import { IconSvg } from '@weco/common/icons';

type ClickableElement = 'a' | 'button';

type StyleProps = {
  isActive?: boolean;
};

export const BorderlessClickableStyle = styled(BaseButton)<StyleProps>`
  background: ${props => props.theme.color('transparent')};
  color: ${props => props.theme.color('charcoal')};
  padding: 10px 8px;

  &:hover {
    background: ${props => props.theme.color('smoke')};
  }

  ${props =>
    props.isActive &&
    `
    background: ${props.theme.color('smoke')};
  `}
`;

type Props = {
  icon?: IconSvg;
  iconPosition?: 'left' | 'right';
  text: string;
  isTextHidden?: boolean;
  isActive?: boolean;
};

type BorderlessClickableProps = Props & { as: ClickableElement };
export const BorderlessClickable: FC<BorderlessClickableProps> = ({
  as,
  icon,
  iconPosition = 'right',
  text,
  isTextHidden,
  isActive,
  ...elementProps
}) => {
  return (
    <BorderlessClickableStyle as={as} isActive={isActive} {...elementProps}>
      <BaseButtonInner isInline={true}>
        <>
          {icon && iconPosition === 'left' && (
            <ButtonIconWrapper iconAfter={true}>
              <Icon icon={icon} />
            </ButtonIconWrapper>
          )}
          <AlignFont
            className={classNames({
              'visually-hidden': !!isTextHidden,
            })}
          >
            {text}
          </AlignFont>
          {icon && iconPosition === 'right' && (
            <ButtonIconWrapper iconAfter={true}>
              <Icon icon={icon} />
            </ButtonIconWrapper>
          )}
        </>
      </BaseButtonInner>
    </BorderlessClickableStyle>
  );
};

type BorderlessLinkProps = Props & ComponentProps<'a'>;
const BorderlessLink: FC<BorderlessLinkProps> = ({
  icon,
  iconPosition,
  text,
  isTextHidden,
  isActive,
  ...elementProps
}) => {
  return (
    <BorderlessClickable
      as="a"
      icon={icon}
      iconPosition={iconPosition}
      text={text}
      isTextHidden={isTextHidden}
      isActive={isActive}
      {...elementProps}
    />
  );
};

type BorderlessButtonProps = Props &
  ComponentProps<'button'> & {
    trackingEvent?: GaEvent;
    clickHandler?: (event: SyntheticEvent<HTMLButtonElement>) => void;
  };
const BorderlessButton: FC<BorderlessButtonProps> = ({
  icon,
  iconPosition,
  text,
  isTextHidden,
  clickHandler,
  trackingEvent,
  isActive,
  ...elementProps
}) => {
  function onClick(event) {
    clickHandler && clickHandler(event);
    trackingEvent && trackEvent(trackingEvent);
  }

  return (
    <BorderlessClickable
      as="button"
      icon={icon}
      iconPosition={iconPosition}
      text={text}
      isTextHidden={isTextHidden}
      isActive={isActive}
      onClick={onClick}
      {...elementProps}
    />
  );
};

export { BorderlessLink, BorderlessButton };
