import { FC } from 'react';
import Image, { ImageLoaderProps } from 'next/image';
import styled from 'styled-components';

import { ImageType } from '@weco/common/model/image';
import { transparentGreyPNG } from '@weco/common/utils/backgrounds';
import {
  iiifImageTemplate,
  convertImageUri,
} from '@weco/common/utils/convert-image-uri';
import {
  convertBreakpointSizesToSizes,
  BreakpointSizes,
} from '@weco/common/views/components/PrismicImage/PrismicImage';

const StyledImage = styled(Image).attrs({ className: 'font-neutral-700' })<{
  background: string;
}>`
  background-color: ${props => props.theme.color(props.background)};
`;

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
  layout: 'raw' | 'fill' | 'fixed';
  priority?: boolean;
  width?: number;
  background?: string;
};

const IIIFImage: FC<Props> = ({
  image,
  sizes,
  onLoadingComplete,
  layout,
  priority = false,
  width = 300,
  background = 'white',
}) => {
  const sizesString = sizes
    ? convertBreakpointSizesToSizes(sizes).join(', ')
    : undefined;

  // The Nextjs Image component has an experimental 'raw' layout feature
  // which will be rendered as a single image element with no wrappers, sizers or other responsive behavior.
  // We may be able to use this in future but, until then, render our own img element.
  if (layout === 'raw') {
    return (
      <img
        src={iiifImageTemplate(image.contentUrl)({
          size: `${width},`,
        })}
        srcSet={''}
        sizes={sizesString}
        alt={image.alt || ''}
      />
    );
  }

  if (layout === 'fixed') {
    return (
      <StyledImage
        layout={layout}
        sizes={sizesString}
        src={image.contentUrl}
        alt={image.alt || ''}
        loader={IIIFLoader}
        onLoadingComplete={onLoadingComplete}
        width={image.width}
        height={image.height}
        priority={priority}
        placeholder="blur"
        blurDataURL={transparentGreyPNG}
        background={background}
      />
    );
  }

  return (
    <StyledImage
      layout={layout}
      sizes={sizesString}
      src={image.contentUrl}
      alt={image.alt || ''}
      loader={IIIFLoader}
      onLoadingComplete={onLoadingComplete}
      objectFit="contain"
      priority={priority}
      background={background}
    />
  );
};

export default IIIFImage;
