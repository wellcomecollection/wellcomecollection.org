import {
  ComponentProps,
  forwardRef,
  ForwardRefRenderFunction,
  ReactNode,
  SyntheticEvent,
} from 'react';
import styled from 'styled-components';

import { IconSvg } from '@weco/common/icons';
import { classNames, typography } from '@weco/common/utils/classnames';
import {
  BaseButtonInner,
  BasicButton,
  ButtonIconWrapper,
} from '@weco/common/views/components/Buttons/Buttons.styles';
import Icon from '@weco/common/views/components/Icon';
import { designSystemColor } from '@weco/common/views/themes/config';

type ClickableElement = 'a' | 'button';

// The hover circle and pill are taller than the header row allows for, so
// negative margins split the difference to keep the row height
const PILL_HEIGHT = 44;
const HEADER_ROW_HEIGHT = 36;

const pillStyles = (isActive?: boolean) => {
  const inverted = `
    background: ${designSystemColor('neutral.70')};
    color: ${designSystemColor('neutral.10')};
  `;

  return `
    color: ${designSystemColor('neutral.70')};
    border-radius: ${PILL_HEIGHT / 2}px;
    height: ${PILL_HEIGHT}px;
    padding: 0 12px;
    transition: none;
    margin-top: ${(HEADER_ROW_HEIGHT - PILL_HEIGHT) / 2}px;
    margin-bottom: ${(HEADER_ROW_HEIGHT - PILL_HEIGHT) / 2}px;

    .icon__shape {
      transition: none;
    }

    &:hover {
      ${inverted}
    }

    ${isActive ? inverted : ''}
  `;
};

const BorderlessClickableStyle = styled(BasicButton)<{
  $isActive?: boolean;
}>`
  background: transparent;
  padding: 10px 8px;

  ${props => pillStyles(props.$isActive)}
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
      data-component="borderless-clickable"
      as={as}
      $isActive={isActive}
      ref={ref}
      {...elementProps}
    >
      <BaseButtonInner $isInline>
        <>
          {iconLeft && (
            <ButtonIconWrapper>
              {/* This is all a little hacky and will need some tidy up */}
              {/* We currently only use this in the header sign in button */}
              <span
                className={typography('body', 'lg', 'regular')}
                style={{ transform: 'translateY(0.01em)' }}
              >
                <Icon icon={iconLeft} matchText />
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
            <ButtonIconWrapper $iconAfter>
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
