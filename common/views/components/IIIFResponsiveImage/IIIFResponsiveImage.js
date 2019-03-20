// @flow

import { classNames } from '../../../utils/classnames';
import { imageSizes } from '../../../utils/image-sizes';
import { type IIIFImageService } from '../../../model/iiif';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';

type Props = {|
  width: number,
  height: ?number,
  imageService: IIIFImageService,
  sizesQueries: ?string,
  alt: string,
  extraClasses?: string,
|};

const IIIFResponsiveImage = ({
  width,
  height,
  imageService,
  sizesQueries,
  alt,
  extraClasses,
}: Props) => {
  const urlTemplate = iiifImageTemplate(imageService['@id']);
  const widths = imageService.sizes
    ? imageService.sizes.map(s => s.width)
    : imageSizes(2048);
  // We want an appropriately sized initial src image for browsers
  // that can't handle srcset. If the service has sizes (thumbnail)
  // then we pick the smallest, otherwise we set a width of 640px
  const initialSrcWidth = imageService.sizes ? widths[0] : 640;

  return (
    <img
      width={width}
      height={height}
      className={classNames({
        image: true,
        [extraClasses || '']: true,
      })}
      src={urlTemplate({ size: `${initialSrcWidth},` })}
      srcSet={
        sizesQueries
          ? widths.map(width => {
              return `${urlTemplate({ size: `${width},` })} ${width}w`;
            })
          : undefined
      }
      sizes={sizesQueries || undefined}
      alt={alt || ''}
    />
  );
};

export default IIIFResponsiveImage;
