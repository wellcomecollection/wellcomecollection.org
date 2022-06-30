import { FC } from 'react';
import Image, { ImageLoaderProps } from 'next/image';
import { classNames } from '@weco/common/utils/classnames';
import { ImageType } from '@weco/common/model/image';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import {
  convertBreakpointSizesToSizes,
  BreakpointSizes,
} from '@weco/common/views/components/PrismicImage/PrismicImage';

const IIIFLoader = ({ src, width }: ImageLoaderProps) => {
  return iiifImageTemplate(src)({ size: `${width},` });
};

export type Props = {
  image: ImageType;
  sizes?: BreakpointSizes;
  onLoadingComplete?: (value: {
    naturalWidth: number;
    naturalHeight: number;
  }) => void;
};

const IIIFImage: FC<Props> = ({ image, sizes, onLoadingComplete }) => {
  const sizesString = sizes
    ? convertBreakpointSizesToSizes(sizes).join(', ')
    : undefined;

  return (
    <Image
      layout="fill"
      className={classNames({
        'bg-white font-charcoal': true,
      })}
      sizes={sizesString}
      src={image.contentUrl}
      alt={image.alt || ''}
      loader={IIIFLoader}
      onLoadingComplete={onLoadingComplete}
      objectFit="contain"
    />
  );
};

export default IIIFImage;
