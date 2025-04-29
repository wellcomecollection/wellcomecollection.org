import {
  ComponentProps,
  forwardRef,
  ForwardRefRenderFunction,
  ReactNode,
  SyntheticEvent,
} from 'react';
import styled from 'styled-components';

import { IconSvg } from '@weco/common/icons';
import { classNames, font } from '@weco/common/utils/classnames';
import {
  BaseButtonInner,
  BasicButton,
  ButtonIconWrapper,
} from '@weco/common/views/components/Buttons/Buttons.styles';
import Icon from '@weco/common/views/components/Icon';

type ClickableElement = 'a' | 'button';

type StyleProps = {
  $isActive?: boolean;
};

const BorderlessClickableStyle = styled(BasicButton)<StyleProps>`
  background: transparent;
  color: ${props => props.theme.color('neutral.700')};
  padding: 10px 8px;

  &:hover {
    background: ${props => props.theme.color('neutral.300')};
  }

  ${props =>
    props.$isActive &&
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
const Button: ForwardRefRenderFunction<
  HTMLButtonElement,
  BorderlessClickableProps
> = (
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
      $isActive={isActive}
      ref={ref}
      {...elementProps}
    >
      <BaseButtonInner $isInline={true}>
        <>
          {iconLeft && (
            <ButtonIconWrapper $iconAfter={false}>
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
            <ButtonIconWrapper $iconAfter={true}>
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
const Link = (props, ref) => {
  return <BorderlessClickable as="a" ref={ref} {...props} />;
};

const BorderlessLink = forwardRef<HTMLButtonElement, BorderlessLinkProps>(Link);

type BorderlessButtonProps = Props &
  ComponentProps<'button'> & {
    clickHandler?: (event: SyntheticEvent<HTMLButtonElement>) => void;
  };
const ButtonOuter = (
  { clickHandler, ...elementProps }: BorderlessButtonProps,
  ref
) => {
  function onClick(event: SyntheticEvent<HTMLButtonElement>) {
    clickHandler && clickHandler(event);
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
