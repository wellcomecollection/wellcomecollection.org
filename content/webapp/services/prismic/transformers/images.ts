import { Image, PromoSliceZone } from '../types';
import {
  EmptyImageFieldImage,
  FilledImageFieldImage,
  RichTextField,
} from '@prismicio/types';
import { CaptionedImage } from '@weco/common/model/captioned-image';
import isEmptyObj from '@weco/common/utils/is-empty-object';
import { ImageType } from '@weco/common/model/image';
import {
  parseImage,
  parseTaslFromString,
  isEmptyHtmlString,
  isImageLink,
} from '@weco/common/services/prismic/parsers';
import { HTMLStringBlock } from '@weco/common/services/prismic/types';

export const placeHolderImage: ImageType = {
  contentUrl: 'https://via.placeholder.com/1600x900?text=%20',
  width: 160,
  height: 900,
  alt: 'Placeholder image',
  tasl: {
    sourceName: 'Unknown',
  },
  crops: {},
};

type Crop = '16:9' | '32:15' | 'square';
export function transformCaptionedImage(
  frag: { image: Image; caption: RichTextField },
  crop?: Crop | undefined
): CaptionedImage {
  if (isEmptyObj(frag.image)) {
    return {
      image: placeHolderImage,
      caption: [
        {
          type: 'paragraph',
          text: '',
          spans: [],
        },
      ],
    };
  }

  const image = crop ? frag.image[crop] : frag.image;
  return {
    image: image?.dimensions ? parseImage(image) : placeHolderImage,
    caption: !isEmptyHtmlString(frag.caption)
      ? (frag.caption as HTMLStringBlock[])
      : [],
  };
}

export function transformPromoToCaptionedImage(
  frag: PromoSliceZone,
  crop: Crop | undefined = '16:9'
): CaptionedImage {
  // We could do more complicated checking here, but this is what we always use.
  const promo = frag[0];
  return transformCaptionedImage(promo.primary, crop);
}

// when images have crops, event if the image isn't attached, we get e.g.
// { '32:15': {}, '16:9': {}, square: {} }
export function isImageLink(
  maybeImage: EmptyImageFieldImage | FilledImageFieldImage
): maybeImage is FilledImageFieldImage {
  return Boolean(maybeImage && maybeImage.dimensions);
}

export function transformImage(
  maybeImage: EmptyImageFieldImage | FilledImageFieldImage | undefined
): ImageType | undefined {
  return maybeImage && isImageLink(maybeImage)
    ? transformFilledImage(maybeImage)
    : undefined;
}

// These are the props returned on a prismic image object
const prismicImageProps = ['dimensions', 'alt', 'copyright', 'url'];

// We don't export this, as we probably always want to check ^ first
function transformFilledImage(image: FilledImageFieldImage): ImageType {
  const tasl = parseTaslFromString(image.copyright);
  const crops = Object.keys(image)
    .filter(key => prismicImageProps.indexOf(key) === -1)
    .filter(key => isImageLink(image[key]))
    .map(key => ({
      key,
      image: transformFilledImage(image[key]),
    }))
    .reduce((acc, { key, image }) => {
      acc[key] = image;
      return acc;
    }, {});

  return {
    contentUrl: image.url,
    width: image.dimensions.width,
    height: image.dimensions.height,
    alt: image.alt!,
    tasl: tasl,
    crops: crops,
  };
}
