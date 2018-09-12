// @flow
import {Fragment} from 'react';
import type {Node} from 'react';
import WobblyEdge from '../WobblyEdge/WobblyEdge';

type Props = {|
  color: 'cream' | 'white',
  children: Node
|}

const WobblyBottom = ({
  color,
  children
}: Props) => (
  <div className='relative'>
    <Fragment>
      {children}
      <WobblyEdge background={color} />
    </Fragment>
  </div>
);
export default WobblyBottom;
