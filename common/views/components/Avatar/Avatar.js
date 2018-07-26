// @flow
import {sized} from '../../../utils/style';
import Image from '../Image/Image';
import type {Props as ImageProps} from '../Image/Image';

type Props = {|
  imageProps: ImageProps
|}

const style = {
  width: sized(12),
  height: sized(12),
  borderRadius: sized(1),
  transform: 'rotateZ(-6deg)',
  overflow: `hidden`
};

const Avatar = ({imageProps}: Props) => (
  <div style={style}>
    <Image {...imageProps} extraClasses={'width-inherit'} style={{
      transform: 'rotateZ(6deg) scale(1.2)'
    }} />
  </div>
);

export default Avatar;
