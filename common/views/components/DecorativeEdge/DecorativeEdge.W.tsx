import styled from 'styled-components';

import { PaletteColor } from '@weco/common/views/themes/config';
import { getPolygonPoints } from '@weco/content/views/components/WShape';

export type Props = {
  color: PaletteColor;
};

export const Edge = styled.div<{
  $variant: 'edge-1' | 'edge-2';
  $color: PaletteColor;
}>`
  height: 10vw;
  margin-top: -10vw;
  position: relative;
  top: 2px;
  z-index: 2;

  @supports ((clip-path: polygon(0 0)) or (-webkit-clip-path: polygon(0 0))) {
    display: block;
    clip-path: ${getPolygonPoints('edge-1')};
  }

  background: ${props => props.theme.color(props.$color)};
`;

const WEdge = ({ color }: Props) => {
  return <Edge $variant="edge-1" $color={color} />;
};

export default WEdge;
