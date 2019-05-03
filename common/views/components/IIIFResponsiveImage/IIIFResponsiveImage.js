// @flow
import Raven from 'raven-js';
import { classNames } from '../../../utils/classnames';
import { imageSizes } from '../../../utils/image-sizes';
import {
  type IIIFImageService,
  type IIIFThumbnailService,
} from '../../../model/iiif';
import { iiifImageTemplate } from '../../../utils/convert-image-uri';

type Props = {|
  width: number,
  height: number,
  imageService: ?IIIFImageService | IIIFThumbnailService,
  contentUrl: ?string,
  sizes: ?string,
  alt: string,
  extraClasses?: string,
  lang: string,
  clickHandler?: () => void,
|};

const IIIFResponsiveImage = ({
  width,
  height,
  imageService,
  contentUrl,
  sizes,
  alt,
  extraClasses,
  lang,
  clickHandler,
}: Props) => {
  const urlTemplate = imageService && iiifImageTemplate(imageService['@id']);
  const widths =
    imageService && imageService.sizes
      ? imageService.sizes.map(s => s.width)
      : imageSizes(2048);
  // We want an appropriately sized initial src image for browsers
  // that can't handle srcset. If the service has sizes (thumbnail)
  // then we pick the smallest, otherwise we set a width of 640px
  const initialSrcWidth = imageService && imageService.sizes ? widths[0] : 640;

  const srcSetString = widths.map(width => {
    return urlTemplate
      ? `${urlTemplate({ size: `${width},` })} ${width}w`
      : contentUrl
      ? `${contentUrl} ${width}w`
      : null;
  });

  return (
    <img
      lang={lang}
      width={width}
      height={height}
      className={classNames({
        image: true,
        [extraClasses || '']: true,
      })}
      onClick={clickHandler}
      onError={event =>
        Raven.captureException(new Error('IIIF image loading error'), {
          tags: {
            service: 'dlcs',
          },
        })
      }
      src={
        urlTemplate ? urlTemplate({ size: `${initialSrcWidth},` }) : contentUrl
      }
      srcSet={srcSetString}
      sizes={sizes}
      alt={alt || ''}
    />
  );
};

export default IIIFResponsiveImage;
