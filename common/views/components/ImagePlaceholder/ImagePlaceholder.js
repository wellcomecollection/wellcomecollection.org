// @flow
import Image from '../Image/Image';
import type {ColorSelection} from '../../../model/color-selections';
import { transparentGif, repeatingLs } from '../../../utils/backgrounds';

type Props = {|
  color: ?ColorSelection
|}

const ImagePlaceholder = ({color}: Props) => (
  <div className='relative'>
    <Image
      contentUrl={transparentGif}
      width={16}
      height={9}
      alt={''}
      extraClasses={`bg-${color || 'purple'}`}
    />
    <div className='absolute' style={{
      backgroundImage: `url(${repeatingLs})`,
      backgroundSize: 'cover',
      width: '100%',
      height: '100%',
      top: '0',
      opacity: '0.5'
    }}></div>
  </div>
);

export default ImagePlaceholder;
