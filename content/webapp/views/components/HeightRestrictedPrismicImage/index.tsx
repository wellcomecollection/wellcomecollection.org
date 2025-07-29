import Image from 'next/image';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { ImageType } from '@weco/common/model/image';
import {
  createPrismicLoader,
  ImageQuality,
} from '@weco/common/views/components/PrismicImage';

export type Props = {
  image: ImageType;
  maxWidth?: number;
  quality: ImageQuality;
};

const PrismicImage = styled(Image)`
  color: ${props => props.theme.color('white')};
  background-color: ${props => props.theme.color('neutral.700')};
  display: block;
`;

function determineSize(viewPortImageDifference: number): string {
  // the further from 0 the more extreme the difference
  if (viewPortImageDifference < 0) {
    // - value means image is more landscape than the aspect ratio of the viewport,
    // so we'll always display at close to 100vw
    return '100vw';
  } else {
    // + value means image is more portrait than the aspect ratio of the viewport,
    // so the bigger the difference, the smaller the image will be displayed
    switch (true) {
      case viewPortImageDifference > 0.75:
        return '25vw';
      case viewPortImageDifference > 0.5:
        return '50vw';
      case viewPortImageDifference > 0.25:
        return '75vw';
      default:
        return '100vw';
    }
  }
}

const aspectRatios = {
  '16/9': 16 / 9,
  '3/2': 3 / 2,
  '4/3': 4 / 3,
  '9/16': 9 / 16,
};

type AspectRatios = typeof aspectRatios;

export function convertVerticalBreakpointSizesToSizes(
  aspectRatios: AspectRatios,
  image: ImageType
): string[] {
  const imageAspectRatio = image.width / image.height;
  return Object.entries(aspectRatios).map(([ratioString, ratioValue]) => {
    const screenImageDifference = ratioValue - imageAspectRatio;
    const size = determineSize(screenImageDifference);
    return `(min-aspect-ratio: ${ratioString}) ${size}`;
  });
}

const HeightRestrictedPrismicImage: FunctionComponent<Props> = ({
  image,
  maxWidth,
  quality,
}) => {
  const vSizesString = convertVerticalBreakpointSizesToSizes(
    aspectRatios,
    image
  ).join(', ');

  // Callers pass the CSS width; we triple it so we still get crisp images on
  // high-resolution displays, but remember not to go beyond the original image!
  const maxLoaderWidth = maxWidth
    ? Math.min(maxWidth * 3, image.width)
    : image.width;

  return (
    <PrismicImage
      data-component="height-restricted-prismic-image"
      width={image.width}
      height={image.height}
      src={image.contentUrl}
      alt={image.alt || ''}
      loader={createPrismicLoader(maxLoaderWidth, quality)}
      sizes={`${vSizesString}, calc(100vw - 84px)`}
      style={{
        width: '100%',
        height: 'auto',
      }}
    />
  );
};

export default HeightRestrictedPrismicImage;
