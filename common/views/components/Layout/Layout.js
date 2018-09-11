import type {Node} from 'react';
import { classNames, grid } from '../../../utils/classnames';
import type {SizeMap} from '../../../utils/classnames';

// @flow

type Props = {|
  gridSizes: SizeMap,
  children: Node
|}

const Layout = ({
  gridSizes,
  children
}: Props) => (
  <div className='grid'>
    <div className={classNames({
      [grid(gridSizes)]: true
    })}>
      {children}
    </div>
  </div>
);
export default Layout;
