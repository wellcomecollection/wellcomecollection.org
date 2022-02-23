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
  asText,
  parseTaslFromString,
  isEmptyHtmlString,
} from '@weco/common/services/prismic/parsers';
import { HTMLStringBlock } from '@weco/common/services/prismic/types';
import { ImagePromo } from '@weco/common/model/image-promo';

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
    image: transformImage(image) || placeHolderImage,
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
function isImageLink(
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

// null is valid to use the default image,
// which isn't on a property, but rather at the root
export function transformImagePromo(
  zone: PromoSliceZone,
  cropType: Crop | null = '16:9'
): ImagePromo | undefined {
  const promoSlice =
    zone && zone.find(slice => slice.slice_type === 'editorialImage');
  const link = promoSlice && promoSlice.primary.link;
  // We introduced enforcing 16:9 half way through, so we have to do a check for it.
  const promoImage =
    promoSlice && cropType
      ? promoSlice.primary.image[cropType] || promoSlice.primary.image
      : promoSlice && promoSlice.primary.image;

  return (
    promoSlice &&
    ({
      caption: asText(promoSlice.primary.caption),
      image: transformImage(promoImage),
      link,
    } as ImagePromo)
  );
}
