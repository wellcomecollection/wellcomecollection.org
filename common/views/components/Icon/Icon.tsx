import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { PaletteColor } from '@weco/common/views/themes/config';
import { IconSvg } from '@weco/common/icons';

type WrapperProps = {
  rotate?: number;
  iconColor?: PaletteColor;
  matchText?: boolean;
};

const Wrapper = styled.span.attrs({
  className: 'icon',
})<WrapperProps>`
  display: inline-block;
  height: ${props => props.theme.iconDimension}px;
  width: ${props => props.theme.iconDimension}px;
  position: relative;
  user-select: none;

  ${props => props.iconColor && `color: ${props.theme.color(props.iconColor)};`}
  ${props => props.rotate && `transform: rotate(${props.rotate}deg);`}

  ${props =>
    props.matchText &&
    `
    height: 1em;
    width: 1em;
  `}

  .icon__svg {
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
  }

  .icon__shape {
    transition: all ${props => props.theme.transitionProperties};
  }
`;

type Props = {
  icon: IconSvg;
  rotate?: number;
  iconColor?: PaletteColor;
  matchText?: boolean;
  title?: string;
  attrs?: { [key: string]: [string] };
};

const Icon: FunctionComponent<Props> = ({
  icon,
  rotate,
  iconColor,
  matchText,
  title,
  attrs = {},
}) => (
  <Wrapper
    rotate={rotate}
    iconColor={iconColor}
    matchText={matchText}
    aria-hidden={title ? true : undefined}
  >
    <svg
      className="icon__svg"
      {...(title
        ? { role: 'img', 'aria-labelledby': `icon-${title}-title` }
        : { 'aria-hidden': true })}
      {...attrs}
    >
      {title && <title id={`icon-${title}-title`}>{title}</title>}
      {/* This type guard is here just in case a string icon makes its way */}
      {/* in via Prismic etc - that shouldn't happen but better safe than sorry. */}
      {typeof icon === 'function' && icon({})}
    </svg>
  </Wrapper>
);

export default Icon;
