// @flow
import Image from '../Image/Image';
import type {ColorSelection} from '../../../model/color-selections';

type Props = {|
  color: ?ColorSelection
|}

const ImagePlaceholder = ({color}: Props) => (
  <div className='relative'>
    <Image
      contentUrl={'https://prismic-io.s3.amazonaws.com/wellcomecollection%2F7ca32858-e347-4282-acaf-c55572961736_transparent.gif'}
      width={16}
      height={9}
      alt={''}
      extraClasses={`bg-${color || 'purple'}`}
    />
    <div className='absolute' style={{
      backgroundImage: 'url(https://prismic-io.s3.amazonaws.com/wellcomecollection%2F805ad61b-fba6-4dc1-b2d3-55dbcda0c9f1_ls_svg.svg)',
      backgroundSize: 'cover',
      width: '100%',
      height: '100%',
      top: '0',
      opacity: '0.5'
    }}></div>
  </div>
);

export default ImagePlaceholder;
