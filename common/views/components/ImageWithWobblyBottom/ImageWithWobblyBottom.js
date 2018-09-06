// @flow
import {Fragment} from 'react';
import {UiImage} from '../Images/Images';
import WobblyEdge from '../WobblyEdge/WobblyEdge';
import type {UiImageProps} from '../Images/Images';
type Props = {|
  image: UiImageProps
|}

const ImageWithWobblyBottom = ({
  image
}: Props) => (
  <div className='relative'>
    <Fragment>
      <UiImage {...image} isFull={true} />
      <WobblyEdge background={'cream'} />
    </Fragment>
  </div>
);
export default ImageWithWobblyBottom;
