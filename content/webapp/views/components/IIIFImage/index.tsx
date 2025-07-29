import Image, { ImageLoaderProps } from 'next/image';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { ImageType } from '@weco/common/model/image';
import {
  convertIiifImageUri,
  convertImageUri,
} from '@weco/common/utils/convert-image-uri';
import {
  BreakpointSizes,
  convertBreakpointSizesToSizes,
} from '@weco/common/views/components/PrismicImage';

const StyledImage = styled(Image)`
  color: ${props => props.theme.color('neutral.700')};
`;

const StyledImageContainer = styled.div<{
  // Not typed as PaletteColor as we want the averageColor of each image
  $background: string;
}>`
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${props => props.$background};
    filter: saturate(50%);
  }

  img {
    z-index: 0;
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
  layout: 'raw' | 'fixed';
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
      <StyledImageContainer $background={background}>
        <img
          src={convertIiifImageUri(image.contentUrl, width)}
          srcSet=""
          sizes={sizesString}
          alt={image.alt || ''}
        />
      </StyledImageContainer>
    );
  }

  return (
    <StyledImageContainer
      data-component="i-i-i-f-image"
      $background={background}
      style={{ height: image.height }} // to not have styledComponents generate too many classes
    >
      <StyledImage
        src={image.contentUrl}
        alt={image.alt || ''}
        loader={IIIFLoader}
        onLoadingComplete={onLoadingComplete}
        width={image.width}
        height={image.height}
        priority={priority}
        sizes={sizesString}
      />
    </StyledImageContainer>
  );
};

export default IIIFImage;
