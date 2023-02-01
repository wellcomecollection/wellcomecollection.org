import {
  ComponentProps,
  FunctionComponent,
  ReactNode,
  SyntheticEvent,
  forwardRef,
} from 'react';
import styled from 'styled-components';
import {
  BaseButton,
  BaseButtonInner,
  ButtonIconWrapper,
} from '../ButtonSolid/ButtonSolid';
import Icon from '../Icon/Icon';
import { classNames, font } from '../../../utils/classnames';
import { GaEvent, trackGaEvent } from '../../../utils/ga';
import { IconSvg } from '@weco/common/icons';

type ClickableElement = 'a' | 'button';

type StyleProps = {
  isActive?: boolean;
};

export const BorderlessClickableStyle = styled(BaseButton)<StyleProps>`
  background: transparent;
  color: ${props => props.theme.color('neutral.700')};
  padding: 10px 8px;

  &:hover {
    background: ${props => props.theme.color('neutral.300')};
  }

  ${props =>
    props.isActive &&
    `
    background: ${props.theme.color('neutral.300')};
  `}
`;

type Props = {
  icon?: IconSvg;
  iconLeft?: IconSvg;
  text: ReactNode;
  isTextHidden?: boolean;
  isActive?: boolean;
};

type BorderlessClickableProps = Props & { as: ClickableElement };
const Button: FunctionComponent<BorderlessClickableProps> = (
  {
    as,
    icon,
    iconLeft,
    text,
    isTextHidden,
    isActive,
    ...elementProps
  }: BorderlessClickableProps,
  ref
) => {
  return (
    <BorderlessClickableStyle
      as={as}
      isActive={isActive}
      ref={ref}
      {...elementProps}
    >
      <BaseButtonInner isInline={true}>
        <>
          {iconLeft && (
            <ButtonIconWrapper iconAfter={false}>
              {/* This is all a little hacky and will need some tidy up */}
              {/* We currently only use this in the header sign in button */}
              <span
                className={font('intr', 4)}
                style={{ transform: 'translateY(0.01em)' }}
              >
                <Icon icon={iconLeft} matchText={true} />
              </span>
            </ButtonIconWrapper>
          )}
          <span
            className={classNames({
              'visually-hidden': !!isTextHidden,
            })}
          >
            {text}
          </span>
          {icon && (
            <ButtonIconWrapper iconAfter={true}>
              <Icon icon={icon} />
            </ButtonIconWrapper>
          )}
        </>
      </BaseButtonInner>
    </BorderlessClickableStyle>
  );
};

const BorderlessClickable = forwardRef<
  HTMLButtonElement,
  BorderlessClickableProps
>(Button);

type BorderlessLinkProps = Props & ComponentProps<'a'>;
const Link: FunctionComponent<BorderlessLinkProps> = (props, ref) => {
  return <BorderlessClickable as="a" ref={ref} {...props} />;
};

const BorderlessLink = forwardRef<HTMLButtonElement, BorderlessLinkProps>(Link);

type BorderlessButtonProps = Props &
  ComponentProps<'button'> & {
    trackingEvent?: GaEvent;
    clickHandler?: (event: SyntheticEvent<HTMLButtonElement>) => void;
  };
const ButtonOuter: FunctionComponent<BorderlessButtonProps> = (
  { clickHandler, trackingEvent, ...elementProps }: BorderlessButtonProps,
  ref
) => {
  function onClick(event: SyntheticEvent<HTMLButtonElement>) {
    clickHandler && clickHandler(event);
    trackingEvent && trackGaEvent(trackingEvent);
  }

  return (
    <BorderlessClickable
      as="button"
      onClick={onClick}
      ref={ref}
      {...elementProps}
    />
  );
};

const BorderlessButton = forwardRef<HTMLButtonElement, BorderlessButtonProps>(
  ButtonOuter
);

export { BorderlessLink, BorderlessButton };
