import { FunctionComponent, ReactElement } from 'react';

import { Container } from '@weco/common/views/components/styled/Container';
import {
  Grid,
  GridCell,
  SizeMap,
} from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';

type GridMap = {
  [key: number]: SizeMap[];
  default: SizeMap[];
};

type Props = {
  items: ReactElement[];
  overrideGridSizes?: GridMap;
};

const s12m6l4xl4: SizeMap = {
  s: [12],
  m: [6],
  l: [4],
  xl: [4],
}; // 3-up on desktop
const s12m6l6xl6: SizeMap = {
  s: [12],
  m: [6],
  l: [6],
  xl: [6],
}; // 2-up on desktop

export const sectionLevelPageGrid: GridMap = {
  1: [{ s: [12], m: [12], l: [12], xl: [12] }],
  2: [
    { s: [12], m: [6], l: [5], xl: [5] },
    { s: [12], m: [6], l: [5], xl: [5] },
  ],
  4: [
    { s: [12], m: [6], l: [5], xl: [5] },
    { s: [12], m: [6], l: [5], xl: [5] },
  ],
  default: [s12m6l4xl4],
};

export const threeUpGridSizesMap: GridMap = {
  default: [s12m6l4xl4],
};

export const twoUpGridSizesMap: GridMap = {
  default: [s12m6l6xl6],
};

const GridFactory: FunctionComponent<Props> = ({
  items,
  overrideGridSizes,
}) => {
  const gridSizesMap = overrideGridSizes || {
    1: [{ s: [12], m: [12], l: [12], xl: [12] }],
    2: [
      { s: [12], m: [6], l: [5, 2], xl: [4, 3] },
      { s: [12], m: [6], l: [5], xl: [4] },
    ],
    4: [
      { s: [12], m: [6], l: [5, 2], xl: [4, 3] },
      { s: [12], m: [6], l: [5], xl: [4] },
    ],
    default: [s12m6l4xl4],
  };

  const gridSizes = gridSizesMap[items?.length] || gridSizesMap.default;

  return (
    <Container>
      <Grid>
        {items.map((item, index) => (
          <GridCell $sizeMap={gridSizes[index % gridSizes.length]} key={index}>
            <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
              {item}
            </Space>
          </GridCell>
        ))}
      </Grid>
    </Container>
  );
};

export default GridFactory;
