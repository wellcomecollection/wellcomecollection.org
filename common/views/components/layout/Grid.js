// @flow
import {grid} from '../../../utils/classnames';
import type {SizeMap} from '../../../utils/classnames';

type Props = {|
  children: React.Node,
  sizes: SizeMap
|}

const Grid = ({children, sizes}: Props) => (
  <div className='grid'>
    <div className={grid(sizes)}>
      {children}
    </div>
  </div>
);

export default Grid;
