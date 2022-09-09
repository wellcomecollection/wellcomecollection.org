import { FC } from 'react';
import Image, { ImageLoaderProps } from 'next/image';
import styled from 'styled-components';
import { ImageType } from '@weco/common/model/image';
import {
  iiifImageTemplate,
  convertImageUri,
} from '@weco/common/utils/convert-image-uri';
import {
  convertBreakpointSizesToSizes,
  BreakpointSizes,
} from '@weco/common/views/components/PrismicImage/PrismicImage';

const StyledImage = styled(Image).attrs({ className: 'font-charcoal' })`
  background-color: ${props => props.theme.color('white')};
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
  priority?: boolean;
  layout: 'raw' | 'fill';
  width?: number;
};

const IIIFImage: FC<Props> = ({
  image,
  sizes,
  onLoadingComplete,
  priority = false,
  layout,
  width = 300,
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
            size: `${width},`,
          })}
          srcSet={''}
          sizes={sizesString}
        />
      ) : (
        <StyledImage
          layout={layout}
          sizes={sizesString}
          src={image.contentUrl}
          alt={image.alt || ''}
          loader={IIIFLoader}
          onLoadingComplete={onLoadingComplete}
          objectFit="contain"
          priority={priority}
        />
      )}
    </>
  );
};

export default IIIFImage;
