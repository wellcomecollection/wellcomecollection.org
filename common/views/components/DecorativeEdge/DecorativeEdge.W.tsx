import styled from 'styled-components';

import { getWShapePoints } from '@weco/common/views/components/WShape';
import { PaletteColor } from '@weco/common/views/themes/config';

export type Props = {
  color: PaletteColor;
  shape: 'edge-1' | 'edge-2';
};

export const Edge = styled.div<{
  $clipPath: string;
  $color: PaletteColor;
}>`
  height: 10vw;
  margin-top: -10vw;
  position: relative;
  top: 2px;
  z-index: 2;

  ${props => props.theme.media('large')`
    height: 125px;
    margin-top: -125px;
  `}

  @supports ((clip-path: polygon(0 0)) or (-webkit-clip-path: polygon(0 0))) {
    display: block;
    clip-path: ${props => props.$clipPath};
  }

  background: ${props => props.theme.color(props.$color)};
`;

const WEdge = ({ color, shape }: Props) => {
  const clipPath = getWShapePoints(shape);
  if (!clipPath) return null;

  return <Edge $clipPath={clipPath} $color={color} />;
};

export default WEdge;
