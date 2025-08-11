import Image, { ImageLoaderProps } from 'next/image';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { ImageType } from '@weco/common/model/image';
import { whiteBackgroundHalfOpacity } from '@weco/common/utils/backgrounds';
import {
  Breakpoint,
  sizes as breakpointSizes,
} from '@weco/common/views/themes/config';

const StyledImage = styled(Image)<{ $desaturate: boolean }>`
  color: ${props => props.theme.color('white')};
  filter: ${props => (props.$desaturate ? 'saturate(0%)' : undefined)};
  width: 100%;
  height: auto;
  display: block;
`;

export type BreakpointSizes = Partial<Record<Breakpoint, number>>;
export type Props = {
  image: ImageType;
  sizes?: BreakpointSizes;
  imgSizes?: string;
  // The maximum width at which the image will be displayed
  maxWidth?: number;
  quality: 'low' | 'high';
  desaturate?: boolean;
};

export function convertBreakpointSizesToSizes(
  sizes: BreakpointSizes
): string[] {
  return Object.entries(sizes).map(
    ([breakpoint, ratio]: [Breakpoint, number]) => {
      const breakpointSize = breakpointSizes[breakpoint];
      // At xlarge we divide the max screen width by the ratio and return
      // exact px as 100vw will always be bigger than the largest the screen can go.
      const size =
        breakpoint === 'xlarge'
          ? `${breakpointSize * ratio}px`
          : `${Math.round(100 * ratio)}vw`;

      return `(min-width: ${breakpointSize}px) ${size}`;
    }
  );
}

export type ImageQuality = 'low' | 'high';

const imageQuality = {
  low: '50',
  high: '100',
};

/**
 * This is based on the imgix loader as next has that built in
 * but we that is configured in the next app, so this will
 * make it run in places like Cardigan and allows us to work with things
 * like prismic using `rect` for crops
 */
export function createPrismicLoader(maxWidth: number, quality: ImageQuality) {
  return ({ src, width }: ImageLoaderProps): string => {
    // e.g. src: https://images.prismic.io/wellcomecollection/5cf4b151-8fa1-47d1-9546-3115debc3b04_Viscera+web+image.jpg?auto=compress,format&rect=0,0,3838,2159&w=3200&h=1800&q=10
    const url = new URL(src);
    const searchParams = new URLSearchParams();

    // This is working around a poor interaction between the Next Image component
    // and Prismic.
    //
    // In particular, this loader will be called for a range of sizes, even if they're
    // wider than the original image.  I think the component assumes that any image
    // resizing service would return the original image in that case, but Prismic will
    // upscale the image instead.
    //
    // e.g. if the original image is 100×100 and you pass ?w=200, Prismic will merrily
    // return an upscaled image that's larger than you need.
    //
    // This clamps the width to a configured maximum, e.g. if you know the image will
    // only be used in a specific context.  It won't ask Prismic for a larger image.
    if (width < maxWidth) {
      searchParams.set('w', width.toString());
    } else {
      searchParams.set('w', maxWidth.toString());
    }

    searchParams.set('auto', 'compress,format');
    searchParams.set('rect', url.searchParams.get('rect') || '');
    searchParams.set('q', imageQuality[quality]);

    return `${url.origin}${url.pathname}?${searchParams.toString()}`;
  };
}

/**
 * the intention here is to become part of the new defacto image component on the site
 * usurping UiImage which has reached a state where it is so bloated it is hard to refactor.
 * This is aimed solely at the Prismic image rendering for now.
 */
const PrismicImage: FunctionComponent<Props> = ({
  image,
  sizes,
  imgSizes,
  maxWidth,
  quality,
  desaturate = false,
}) => {
  const sizesString = sizes
    ? convertBreakpointSizesToSizes(sizes).join(', ')
    : undefined;

  // Callers pass the CSS width; we triple it so we still get crisp images on
  // high-resolution displays, but remember not to go beyond the original image!
  const maxLoaderWidth = maxWidth
    ? Math.min(maxWidth * 3, image.width)
    : image.width;

  return (
    <StyledImage
      data-component="prismic-image"
      width={image.width}
      height={image.height}
      src={image.contentUrl}
      alt={image.alt || ''}
      $desaturate={desaturate}
      loader={createPrismicLoader(maxLoaderWidth, quality)}
      sizes={imgSizes || sizesString}
      placeholder="blur"
      blurDataURL={whiteBackgroundHalfOpacity}
    />
  );
};

export default PrismicImage;
