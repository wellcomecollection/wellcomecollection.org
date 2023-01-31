import { FunctionComponent } from 'react';
import Image, { ImageLoaderProps } from 'next/image';
import styled from 'styled-components';

import { ImageType } from '@weco/common/model/image';
import {
  convertImageUri,
  convertIiifImageUri,
} from '@weco/common/utils/convert-image-uri';
import {
  convertBreakpointSizesToSizes,
  BreakpointSizes,
} from '@weco/common/views/components/PrismicImage/PrismicImage';

// Not typed as PaletteColor as we want the averageColor of each image
const StyledImage = styled(Image)<{ background: string }>`
  background-color: ${props => props.background};
  color: ${props => props.theme.color('neutral.700')};
`;

const StyledImageContainer = styled.div<{
  background: string;
}>`
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${props => props.background};
    filter: saturate(50%);
    z-index: -1;
  }
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

const IIIFImage: FunctionComponent<Props> = ({
  image,
  sizes,
  onLoadingComplete,
  layout,
  priority = false,
  width = 300,
  background = 'transparent',
}) => {
  const sizesString = sizes
    ? convertBreakpointSizesToSizes(sizes).join(', ')
    : undefined;

  // The Nextjs Image component has an experimental 'raw' layout feature
  // which will be rendered as a single image element with no wrappers, sizers or other responsive behavior.
  // We may be able to use this in future but, until then, render our own img element.
  if (layout === 'raw') {
    return (
      <StyledImageContainer background={background}>
        <img
          src={convertIiifImageUri(image.contentUrl, width)}
          srcSet={''}
          sizes={sizesString}
          alt={image.alt || ''}
        />
      </StyledImageContainer>
    );
  }

  if (layout === 'fixed') {
    return (
      <StyledImageContainer
        background={background}
        style={{ height: image.height }} // to not have styledComponents generate too many classes
      >
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
          background="transparent"
        />
      </StyledImageContainer>
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
