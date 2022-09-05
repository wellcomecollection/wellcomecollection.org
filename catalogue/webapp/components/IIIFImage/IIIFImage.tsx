import { FC } from 'react';
import Image, { ImageLoaderProps } from 'next/image';

import { ImageType } from '@weco/common/model/image';
import {
  iiifImageTemplate,
  convertImageUri,
} from '@weco/common/utils/convert-image-uri';
import {
  convertBreakpointSizesToSizes,
  BreakpointSizes,
} from '@weco/common/views/components/PrismicImage/PrismicImage';

const IIIFLoader = ({ src, width }: ImageLoaderProps) => {
  return convertImageUri(src, width);
};

export type Props = {
  image: ImageType;
  sizes?: BreakpointSizes;
  onLoadingComplete?: (value: {
    naturalWidth: number;
    naturalHeight: number;
  }) => void;
  priority?: boolean;
  layout: 'raw' | 'fill';
};

const IIIFImage: FC<Props> = ({
  image,
  sizes,
  onLoadingComplete,
  priority = false,
  layout,
}) => {
  const sizesString = sizes
    ? convertBreakpointSizesToSizes(sizes).join(', ')
    : undefined;

  return (
    <>
      {/*
        The Nextjs Image component has an experimental 'raw' layout feature
        which will be rendered as a single image element with no wrappers, sizers or other responsive behavior.
        We may be able to use this in future but, until then, render our own img element.
      */}
      {layout === 'raw' ? (
        <img
          src={iiifImageTemplate(image.contentUrl)({
            size: `${image.width},`,
          })}
          srcSet={''}
          sizes={sizesString}
        />
      ) : (
        <Image
          sizes={sizesString}
          src={image.contentUrl}
          alt={image.alt || ''}
          loader={IIIFLoader}
          onLoadingComplete={onLoadingComplete}
          width={image.width}
          height={image.height}
          priority={priority}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNctWxZEQAGYgJqdIxNSwAAAABJRU5ErkJggg=="
        />
      )}
    </>
  );
};

export default IIIFImage;
