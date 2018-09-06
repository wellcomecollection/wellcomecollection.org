// @flow
import type {Picture as PictureProps} from '../../../model/picture';
import Tasl from '../Tasl/Tasl';
import {imageSizes} from '../../../utils/image-sizes';
import {convertImageUri} from '../../../utils/convert-image-uri';

type Props = {|
  images: PictureProps[],
  extraClasses?: string,
  isFull: boolean
|};

const Picture = ({ images, extraClasses, isFull = false }: Props) => {
  const lastImage = images[images.length - 1];
  const { title, author, license, copyright, source } = lastImage;
  const tasl = {
    title,
    author,
    license,
    copyrightHolder: copyright && copyright.holder,
    copyrightLink: copyright && copyright.link,
    sourceName: source && source.name,
    sourceLink: source && source.link
  };

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

export default Picture;
