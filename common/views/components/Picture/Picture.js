// @flow
import Tasl from '../Tasl/Tasl';
import {imageSizes} from '../../../utils/image-sizes';
import {convertImageUri} from '../../../utils/convert-image-uri';
import type {UiImageProps} from '../Images/Images';
import type {Picture as PictureProps} from '../../../model/picture';

type Props = {|
  images: PictureProps[],
  extraClasses?: string,
  isFull: boolean
|};

// Deprecated: Use `PictureFromImages`. We're deprecating the Picture type.
const Picture = ({ images, extraClasses, isFull = false }: Props) => {
  const lastImage = images[images.length - 1];
  const { tasl } = lastImage;

  return (
    <figure className='relative no-margin'>
      <picture className={extraClasses || ''}>
        {images.map(image => {
          if (image.width) {
            const sizes = imageSizes(image.width);
            return (
              <source
                key={image.contentUrl}
                media={image.minWidth ? `(min-width: ${image.minWidth})` : ''}
                sizes='100vw'
                srcSet={sizes.map(size => {
                  return image.contentUrl && `${convertImageUri(image.contentUrl, size, false)} ${size}w`;
                })} />
            );
          }
        })}

        {lastImage && lastImage.contentUrl && lastImage.width && <img
          className='image block'
          src={convertImageUri(lastImage.contentUrl, lastImage.width, false)}
          alt={lastImage.alt} />}
      </picture>
      {tasl && <Tasl {...tasl} isFull={isFull} />}
    </figure>
  );
};

type PictureFromImagesProps = {|
  images: UiImageProps[],
  minWidths: string[],
  extraClasses?: string,
  isFull: boolean
|};
export const PictureFromImages = ({
  images,
  minWidths,
  extraClasses,
  isFull = false
}: PictureFromImagesProps) => {
  const lastImage = images[images.length - 1];
  return (
    <figure className='relative no-margin'>
      <picture className={extraClasses || ''}>
        {images.map((image, i) => {
          if (image.width) {
            const sizes = imageSizes(image.width);
            return (
              <source
                key={image.contentUrl}
                media={minWidths[i] ? `(min-width: ${minWidths[i]})` : ''}
                sizes='100vw'
                data-srcset={sizes.map(size => {
                  return image.contentUrl && `${convertImageUri(image.contentUrl, size, false)} ${size}w`;
                })} />
            );
          }
        })}

        {lastImage && lastImage.contentUrl && lastImage.width && <img
          height={lastImage.height}
          width={lastImage.width}
          className='image lazy-image lazyload'
          data-src={convertImageUri(lastImage.contentUrl, lastImage.width, false)}
          alt={lastImage.alt} />}
      </picture>
      {lastImage && <Tasl {...lastImage.tasl} />}
    </figure>
  );
};

export default Picture;
