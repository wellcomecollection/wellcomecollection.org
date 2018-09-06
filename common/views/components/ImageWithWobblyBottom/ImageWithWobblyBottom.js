// @flow
import type Picture from '../Picture/Picture';
import type {UiImage} from '../Images/Images';
type Props = {|
  image: UiImage | Picture
|}

const ImageWithWobblyBottom = ({
  image
}: Props) => (<div></div>);
export default ImageWithWobblyBottom;
