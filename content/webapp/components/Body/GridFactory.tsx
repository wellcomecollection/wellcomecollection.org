import { FunctionComponent, ReactElement } from 'react';

import { Container } from '@weco/common/views/components/styled/Container';
import {
  BetterSizeMap,
  GridCell,
} from '@weco/common/views/components/styled/GridCell';
import Space from '@weco/common/views/components/styled/Space';

type GridMap = {
  [key: number]: BetterSizeMap[];
  default: BetterSizeMap[];
};

type Props = {
  items: ReactElement[];
  overrideGridSizes?: GridMap;
};

const s12m6l4xl4: BetterSizeMap = {
  s: ['auto', 12],
  m: ['auto', 6],
  l: ['auto', 4],
  xl: ['auto', 4],
}; // 3-up on desktop
const s12m6l6xl6: BetterSizeMap = {
  s: ['auto', 12],
  m: ['auto', 6],
  l: ['auto', 6],
  xl: ['auto', 6],
}; // 2-up on desktop

export const sectionLevelPageGrid: GridMap = {
  1: [{ s: ['auto', 12], m: ['auto', 12], l: ['auto', 12], xl: ['auto', 12] }],
  2: [
    { s: ['auto', 12], m: ['auto', 6], l: ['auto', 5], xl: ['auto', 5] },
    { s: ['auto', 12], m: ['auto', 6], l: ['auto', 5], xl: ['auto', 5] },
  ],
  4: [
    { s: ['auto', 12], m: ['auto', 6], l: ['auto', 5], xl: ['auto', 5] },
    { s: ['auto', 12], m: ['auto', 6], l: ['auto', 5], xl: ['auto', 5] },
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
    1: [
      { s: ['auto', 12], m: ['auto', 12], l: ['auto', 12], xl: ['auto', 12] },
    ],
    2: [
      { s: ['auto', 12], m: ['auto', 6], l: [2, 5], xl: [3, 4] },
      { s: ['auto', 12], m: ['auto', 6], l: ['auto', 5], xl: ['auto', 4] },
    ],
    4: [
      { s: ['auto', 12], m: ['auto', 6], l: [2, 5], xl: [3, 4] },
      { s: ['auto', 12], m: ['auto', 6], l: ['auto', 5], xl: ['auto', 4] },
    ],
    default: [s12m6l4xl4],
  };

  const gridSizes = gridSizesMap[items?.length] || gridSizesMap.default;

  return (
    <Container>
      <div className="grid">
        {items.map((item, index) => (
          <GridCell $sizeMap={gridSizes[index % gridSizes.length]} key={index}>
            <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
              {item}
            </Space>
          </GridCell>
        ))}
      </div>
    </Container>
  );
};

export default GridFactory;
