import { FilledImageFieldImage } from '@prismicio/types';
import { classNames } from '@weco/common/utils/classnames';
import { getImageUrlAtSize } from '../../services/prismic/images';

type Props = {
  image: FilledImageFieldImage;
};

/**
 * the intention here is to become part of the new defacto image component on the site
 * usurping UiImage which has reached a state where it is so bloated it is hard to refactor.
 * This is aimed solely at the Prismic image rendering for now.
 */
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
