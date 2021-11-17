import { FilledImageFieldImage } from '@prismicio/types';
import { classNames } from '@weco/common/utils/classnames';
import { getImageUrlAtSize } from '../../services/prismic/images';

type Props = {
  image: FilledImageFieldImage;
};

const Image = ({ image }: Props) => {
  return (
    <img
      width={image.dimensions.width}
      height={image.dimensions.height}
      className={classNames({
        'lazy-image bg-charcoal font-white': true,
        lazyload: true,
        image: true,
      })}
      src={getImageUrlAtSize(image, { w: 160 })}
      alt={image.alt || ''}
    />
  );
};

export default Image;
