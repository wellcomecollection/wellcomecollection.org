// @flow
import {Fragment} from 'react';
import type {Node} from 'react';
import WobblyEdge from '../WobblyEdge/WobblyEdge';

type Props = {|
  children: Node
|}

const ImageWithWobblyBottom = ({
  children
}: Props) => (
  <div className='relative'>
    <Fragment>
      {children}
      <WobblyEdge background={'cream'} />
    </Fragment>
  </div>
);
export default ImageWithWobblyBottom;
