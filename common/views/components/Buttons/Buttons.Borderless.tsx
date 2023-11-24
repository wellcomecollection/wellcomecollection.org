import { ReactNode, SyntheticEvent } from 'react';
import { LinkProps } from 'next/link';
import styled from 'styled-components';
import {
  BasicButton,
  BaseButtonInner,
  ButtonIconWrapper,
} from '@weco/common/views/components/Buttons/Buttons.styles';
import Icon from '@weco/common/views/components/Icon/Icon';
import { classNames, font } from '@weco/common/utils/classnames';
import { IconSvg } from '@weco/common/icons';

const BorderlessClickableStyle = styled(BasicButton)<{
  $isActive?: boolean;
}>`
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
  clickHandler?: (event: SyntheticEvent<HTMLButtonElement>) => void;
};

export type BorderlessClickableProps = Props &
  (
    | (LinkProps & { as: 'a' })
    | (React.ButtonHTMLAttributes<HTMLButtonElement> & { as: 'button' })
  );
const BorderlessClickable = ({
  as,
  icon,
  iconLeft,
  text,
  isTextHidden,
  isActive,
  clickHandler,
  ...elementProps
}: BorderlessClickableProps) => {
  return (
    <BorderlessClickableStyle
      as={as}
      $isActive={isActive}
      {...(clickHandler && {
        onClick: event => clickHandler && clickHandler(event),
      })}
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
          <span className={classNames({ 'visually-hidden': !!isTextHidden })}>
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

export default BorderlessClickable;
