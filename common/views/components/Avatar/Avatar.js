// @flow
import {sized} from '../../../utils/style';
import Image from '../Image/Image';
import type {Props as ImageProps} from '../Image/Image';

type Props = {|
  imageProps: ImageProps
|}

const style = {
  width: sized(13),
  height: sized(13),
  clipPath: `inset(${sized(1)} round ${sized(1)})`,
  transform: 'rotateZ(-6deg)'
};

const Avatar = ({imageProps}: Props) => (
  <div className={`rotated-rounded-corners`} style={style}>
    <Image {...imageProps} extraClasses={'width-inherit'} style={{
      transform: 'rotateZ(6deg)'
    }} />
  </div>
);

export default Avatar;
