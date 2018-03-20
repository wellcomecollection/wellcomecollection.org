// @flow
import type {Picture as PictureProps} from '../../../model/picture';
import Tasl from '../Tasl/Tasl';
import {imageSizes} from '../../../utils/image-sizes';
import {convertImageUri} from '../../../utils/convert-image-uri';

type Props = {|
  images: PictureProps[],
  extraClasses?: string
|};

const Picture = ({ images, extraClasses }: Props) => {
  const lastImage = images[images.length - 1];
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
      {lastImage && <Tasl
        // TODO: Maybe fill with placeholder so the content team can see it?
        contentUrl={lastImage.contentUrl || ''}
        title={lastImage.title}
        author={lastImage.author}
        sourceName={lastImage.source && lastImage.source.name}
        sourceLink={lastImage.source && lastImage.source.link}
        license={lastImage.license}
        copyrightHolder={lastImage.copyright && lastImage.copyright.holder}
        copyrightLink={lastImage.copyright && lastImage.copyright.link}
        isFull={false}
      />}
    </figure>
  );
};

export default Picture;
