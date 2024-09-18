import { FunctionComponent, ReactElement } from 'react';

import { grid } from '@weco/common/utils/classnames';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';

type Grid = {
  s: number;
  m: number;
  l: number;
  xl: number;
};

type GridMap = {
  [key: number]: Grid[];
  default: Grid[];
};

type Props = {
  items: ReactElement[];
  overrideGridSizes?: GridMap;
};

const s12m6l4xl4 = { s: 12, m: 6, l: 4, xl: 4 }; // 3-up on desktop
const s12m6l6xl6 = { s: 12, m: 6, l: 6, xl: 6 }; // 2-up on desktop

export const sectionLevelPageGrid: GridMap = {
  1: [{ s: 12, m: 12, l: 12, xl: 12 }],
  2: [
    { s: 12, m: 6, l: 5, xl: 5 },
    { s: 12, m: 6, l: 5, xl: 5 },
  ],
  4: [
    { s: 12, m: 6, l: 5, xl: 5 },
    { s: 12, m: 6, l: 5, xl: 5 },
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
    1: [{ s: 12, m: 12, l: 12, xl: 12 }],
    2: [
      { s: 12, m: 6, l: 5, shiftL: 1, xl: 4, shiftXl: 2 },
      { s: 12, m: 6, l: 5, xl: 4 },
    ],
    4: [
      { s: 12, m: 6, l: 5, shiftL: 1, xl: 4, shiftXl: 2 },
      { s: 12, m: 6, l: 5, xl: 4 },
    ],
    default: [s12m6l4xl4],
  };

  const gridSizes = gridSizesMap[items?.length] || gridSizesMap.default;

  return (
    <Container>
      <div className="grid">
        {items.map((item, index) => (
          <Space
            $v={{ size: 'l', properties: ['margin-bottom'] }}
            key={index}
            className={grid(gridSizes[index % gridSizes.length])}
          >
            {item}
          </Space>
        ))}
      </div>
    </Container>
  );
};

export default GridFactory;
