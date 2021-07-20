import { FunctionComponent } from 'react';
import * as icons from '../../../icons';
import styled from 'styled-components';
import { PaletteColor } from '@weco/common/views/themes/config';

type WrapperProps = {
  rotate?: number;
  color?: PaletteColor;
  matchText?: boolean;
};

const Wrapper = styled.div.attrs({
  className: 'icon',
})<WrapperProps>`
  display: inline-block;
  height: ${props => props.theme.iconDimension}px;
  width: ${props => props.theme.iconDimension}px;
  position: relative;
  user-select: none;

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

  ${props =>
    props.color &&
    `
  .icon__shape {
    fill: ${props.theme.color(props.color)};
  }

  .icon__stroke {
    stroke: ${props.theme.color(props.color)};
  }
`}

  ${props =>
    props.rotate &&
    `
  transform: rotate(${props.rotate}deg);
`}
`;

type Props = {
  name: string;
  rotate?: number;
  color?: PaletteColor;
  matchText?: boolean;
  title?: string;
  attrs?: { [key: string]: [string] };
};

const Icon: FunctionComponent<Props> = ({
  name,
  rotate,
  color,
  matchText,
  title,
  attrs = {},
}: Props) => (
  <Wrapper
    rotate={rotate}
    color={color}
    matchText={matchText}
    aria-hidden={title ? true : undefined}
  >
    <svg
      className="icon__svg"
      {...(title
        ? { role: 'img', 'aria-labelledby': `icon-${name}-title` }
        : { 'aria-hidden': true })}
      {...attrs}
    >
      {title && <title id={`icon-${name}-title`}>{title}</title>}
      {icons[name]()}
    </svg>
  </Wrapper>
);

export default Icon;
