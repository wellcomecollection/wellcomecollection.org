// @flow
import Image from '../Image/Image';
import type {Props as ImageProps} from '../Image/Image';

type Props = {|
  imageProps: ImageProps
|}

const Avatar = ({imageProps}: Props) => (
  <div className={`avatar rotated-rounded-corners`}>
    <Image {...imageProps} extraClasses={'width-inherit'} />
  </div>
);

export default Avatar;
