import Tasl from '../Tasl/Tasl';
import { imageSizes } from '../../../utils/image-sizes';
import { convertImageUri } from '../../../utils/convert-image-uri';
import { Picture as PictureProps } from '../../../model/picture';
import { FunctionComponent } from 'react';
import { ImageType } from '../../../model/image';

type UiImageProps = ImageType & {
  extraClasses?: string;
  isFull?: boolean;
  isWidthAuto?: boolean;
  setComputedImageWidth?: (value: number) => void;
  setIsWidthAuto?: (value: boolean) => void;
};

type Props = {
  images: PictureProps[];
  extraClasses?: string;
  isFull: boolean;
};

// Deprecated: Use `PictureFromImages`. We're deprecating the Picture type.
export const Picture: FunctionComponent<Props> = ({
  images,
  extraClasses,
  isFull = false,
}: Props) => {
  const lastImage = images[images.length - 1];
  const { tasl } = lastImage;

  return (
    <figure className="relative no-margin">
      <picture className={extraClasses || ''}>
        {images.map(image => {
          if (image.width) {
            const sizes = imageSizes(image.width);
            return (
              <source
                key={image.contentUrl}
                media={image.minWidth ? `(min-width: ${image.minWidth})` : ''}
                sizes="100vw"
                srcSet={sizes
                  .map(size => {
                    return (
                      image.contentUrl &&
                      `${convertImageUri(image.contentUrl, size)} ${size}w`
                    );
                  })
                  .join(', ')}
              />
            );
          }
        })}

        {lastImage && lastImage.contentUrl && (
          <img
            className="image block"
            src={convertImageUri(lastImage.contentUrl, 1200)}
            alt={lastImage.alt || ''}
          />
        )}
      </picture>
      {tasl && <Tasl {...tasl} positionTop={isFull} />}
    </figure>
  );
};

// The order of the images is important, you need to have it from:
// maximum min-width -> minimum min-width
type PictureFromImagesProps = {
  images: { string: UiImageProps }; // the key here is the minwidth
  extraClasses?: string;
  isFull: boolean;
};
export const PictureFromImages: FunctionComponent<PictureFromImagesProps> = ({
  images,
  extraClasses,
  isFull = false,
}: PictureFromImagesProps) => {
  const minWidths = Object.keys(images);
  const lastImage = images[minWidths[0]];

  return (
    <figure className="relative no-margin">
      <picture className={extraClasses || ''}>
        {minWidths.map(minWidth => {
          const image = images[minWidth];
          if (image.width) {
            const sizes = imageSizes(image.width);

            return (
              <source
                key={image.contentUrl}
                media={minWidth !== 'default' ? `(min-width: ${minWidth})` : ''}
                sizes="100vw"
                data-srcset={sizes.map(size => {
                  return (
                    image.contentUrl &&
                    `${convertImageUri(image.contentUrl, size)} ${size}w`
                  );
                })}
              />
            );
          }
        })}

        {lastImage && lastImage.contentUrl && (
          <img
            height={lastImage.height}
            width={lastImage.width}
            data-src={convertImageUri(lastImage.contentUrl, 1200)}
            alt={lastImage.alt || ''}
          />
        )}
      </picture>
      {lastImage && <Tasl {...lastImage.tasl} positionTop={isFull} />}
    </figure>
  );
};

export default Picture;
