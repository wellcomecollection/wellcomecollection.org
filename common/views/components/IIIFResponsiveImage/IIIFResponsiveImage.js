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

const ResponsiveImage = ({
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

  return (
    <>
      <noscript
        dangerouslySetInnerHTML={{
          __html: `
            <img width='${width}'
              height='${height || ''}'
              class='image image--noscript'
              src=${urlTemplate({ size: `${widths[0]},` })}
              alt='${alt || ''}' />`,
        }}
      />

      <img
        width={width}
        height={height}
        className={classNames({
          image: true,
          [extraClasses || '']: true,
        })}
        src={urlTemplate({ size: `${widths[0]},` })}
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
    </>
  );
};

export default ResponsiveImage;
