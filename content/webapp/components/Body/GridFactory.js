import { classNames, grid } from '../../../utils/classnames';
import Space from '../styled/Space';

type Props = {
  items: any[],
  overrideGridSizes?: any,
};

export const sectionLevelPageGrid = {
  1: [{ s: 12, m: 12, l: 12, xl: 12 }],
  2: [
    { s: 12, m: 6, l: 5, xl: 5 },
    { s: 12, m: 6, l: 5, xl: 5 },
  ],
  4: [
    { s: 12, m: 6, l: 5, xl: 5 },
    { s: 12, m: 6, l: 5, xl: 5 },
  ],
};

const GridFactory = ({ items, overrideGridSizes }: Props) => {
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
  };

  const gridSizes = gridSizesMap[items.length] || [
    { s: 12, m: 6, l: 4, xl: 4 },
  ];

  return (
    <div className="container">
      <div className="grid">
        {items.map((item, index) => (
          <Space
            v={{ size: 'l', properties: ['margin-bottom'] }}
            key={index}
            className={classNames({
              [grid(gridSizes[index % gridSizes.length])]: true,
            })}
          >
            {item}
          </Space>
        ))}
      </div>
    </div>
  );
};

export default GridFactory;
