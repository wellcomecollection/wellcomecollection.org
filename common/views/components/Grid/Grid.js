// @flow
import {cssGrid} from '../../../utils/classnames';
import type {SizeMap} from '../../../utils/classnames';

type Props = {|
  children: React.Node[] | React.Node,
  sizes: SizeMap
|}

const Grid = ({children, sizes}: Props) => (
  <div className='css-grid__container'>
    <div className='css-grid'>
      {Array.isArray(children) && children.map((child, i) =>
        <div className={cssGrid(sizes)} key={i}>
          {child}
        </div>
      )}
      {!Array.isArray(children) &&
        <div className={cssGrid(sizes)}>
          {children}
        </div>
      }
    </div>
  </div>
);

export default Grid;
