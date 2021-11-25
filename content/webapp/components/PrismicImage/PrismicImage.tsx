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
 * This is based on the imgix loader as next has that built in
 * but we that is configured in the next app, so this will
 * make it run in places like Cardigan and allows us to work with things
 * like prismic using `rect` for crops
 */
const prismicLoader = ({ src, width, quality }) => {
  // e.g. src: https://images.prismic.io/wellcomecollection/5cf4b151-8fa1-47d1-9546-3115debc3b04_Viscera+web+image.jpg?auto=compress,format&rect=0,0,3838,2159&w=3200&h=1800
  const url = new URL(src);
  const searchParams = new URLSearchParams();
  searchParams.set(`w`, width);
  searchParams.set(`auto`, 'compress,format');
  searchParams.set(`rect`, url.searchParams.get('rect') || '');
  searchParams.set(`q`, quality || 75);

  return `${url.origin}${url.pathname}?${searchParams.toString()}`;
};

/**
 * the intention here is to become part of the new defacto image component on the site
 * usurping UiImage which has reached a state where it is so bloated it is hard to refactor.
 * This is aimed solely at the Prismic image rendering for now.
 */
const PrismicImage = ({ image, sizes }: Props) => {
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
      src={image.url}
      alt={image.alt || ''}
      loader={prismicLoader}
    />
  );
};

export default PrismicImage;
