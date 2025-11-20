import { css } from 'styled-components';

import { PaletteColor } from '@weco/common/views/themes/config';

export type AnimatedUnderlineProps = {
  $lineColor: PaletteColor;
  $lineThickness?: number;
};

const AnimatedUnderlineCSS = css<AnimatedUnderlineProps>`
  --line-color: ${props => props.theme.color(props.$lineColor)};

  position: relative;

  & > span {
    background-image: linear-gradient(
      0deg,
      var(--line-color) 0%,
      var(--line-color) 100%
    );
    background-position: 0% 100%;
    background-repeat: no-repeat;
    background-size: var(--background-size, 0%)
      ${props => props.$lineThickness || 2}px;
    transition: background-size ${props => props.theme.transitionProperties};
    transform: translateZ(0);
    padding-bottom: 2px;
  }

  &:hover {
    --background-size: 100%;
  }
`;

export default AnimatedUnderlineCSS;
