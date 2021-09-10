import { ComponentProps, FC, ReactNode, SyntheticEvent } from 'react';
import styled from 'styled-components';
import {
  BaseButton,
  BaseButtonInner,
  ButtonIconWrapper,
} from '../ButtonSolid/ButtonSolid';
import AlignFont from '../styled/AlignFont';
import Icon from '../Icon/Icon';
import { classNames, font } from '../../../utils/classnames';
import { GaEvent, trackEvent } from '../../../utils/ga';

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
  icon?: string;
  iconLeft?: string;
  text: ReactNode;
  isTextHidden?: boolean;
  isActive?: boolean;
};

type BorderlessClickableProps = Props & { as: ClickableElement };
export const BorderlessClickable: FC<BorderlessClickableProps> = ({
  as,
  icon,
  iconLeft,
  text,
  isTextHidden,
  isActive,
  ...elementProps
}) => {
  return (
    <BorderlessClickableStyle as={as} isActive={isActive} {...elementProps}>
      <BaseButtonInner isInline={true}>
        <>
          {iconLeft && (
            <ButtonIconWrapper iconAfter={false}>
              {/* This is all a little hacky and will need some tidy up */}
              {/* We currently only use this in the header sign in button */}
              <span
                className={classNames({
                  [font('hnr', 4)]: true,
                })}
                style={{ transform: 'translateY(0.01em)' }}
              >
                <Icon name={iconLeft} matchText={true} />
              </span>
            </ButtonIconWrapper>
          )}
          <AlignFont
            className={classNames({
              'visually-hidden': !!isTextHidden,
            })}
          >
            {text}
          </AlignFont>
          {icon && (
            <ButtonIconWrapper iconAfter={true}>
              <Icon name={icon} />
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
  iconLeft,
  text,
  isTextHidden,
  isActive,
  ...elementProps
}) => {
  return (
    <BorderlessClickable
      as="a"
      icon={icon}
      iconLeft={iconLeft}
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
  iconLeft,
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
      iconLeft={iconLeft}
      text={text}
      isTextHidden={isTextHidden}
      isActive={isActive}
      onClick={onClick}
      {...elementProps}
    />
  );
};

export { BorderlessLink, BorderlessButton };
