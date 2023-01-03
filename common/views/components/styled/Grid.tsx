import { FunctionComponent, ReactNode } from 'react';
import { grid, SizeMap } from '../../../utils/classnames';

type GridProps = {
  sizes: SizeMap;
  children: ReactNode;
};

const Grid: FunctionComponent<GridProps> = ({ sizes, children }) => (
  <div className="grid">
    <div className={grid(sizes)}>{children}</div>
  </div>
);

export default Grid;
