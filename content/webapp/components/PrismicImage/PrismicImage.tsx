import Image from 'next/image';
import { FilledImageFieldImage } from '@prismicio/types';
import { classNames } from '@weco/common/utils/classnames';
import {
  Breakpoint,
  sizes as breakpointSizes,
} from '@weco/common/views/themes/config';

type BreakpointSizes = Partial<Record<Breakpoint, number>>;
type Props = {
  image: FilledImageFieldImage;
  sizes?: BreakpointSizes;
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
          : `${100 * ratio}vw`;

      return `(min-width: ${breakpointSize}px) ${size}`;
    }
  );
}

/**
 * the intention here is to become part of the new defacto image component on the site
 * usurping UiImage which has reached a state where it is so bloated it is hard to refactor.
 * This is aimed solely at the Prismic image rendering for now.
 */
const PrismicImage = ({ image, sizes }: Props) => {
  const url = new URL(image.url);
  const src = url.pathname;
  // Crops from prismic always have the `rect` value on them
  const rect = url.searchParams.get('rect');

  const sizesString = sizes
    ? convertBreakpointSizesToSizes(sizes).join(', ')
    : undefined;

  return (
    <Image
      width={image.dimensions.width}
      height={image.dimensions.height}
      layout="responsive"
      className={classNames({
        'image bg-charcoal font-white': true,
      })}
      sizes={sizesString}
      src={`${src}?auto=format,compress&rect=${rect}`}
      alt={image.alt || ''}
    />
  );
};

export default PrismicImage;
