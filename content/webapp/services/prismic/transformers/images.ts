import * as prismic from '@prismicio/client';

import { CaptionedImage } from '@weco/common/model/captioned-image';
import { Crop, ImageType } from '@weco/common/model/image';
import { transformImage } from '@weco/common/services/prismic/transformers/images';
import { Image, PromoSliceZone } from '@weco/content/services/prismic/types';
import { ImagePromo } from '@weco/content/types/image-promo';
import isEmptyObj from '@weco/content/utils/is-empty-object';

import { asRichText, asText } from '.';

export const placeHolderImage: ImageType = {
  contentUrl: 'https://via.placeholder.com/1600x900?text=%20',
  width: 160,
  height: 900,
  alt: 'Placeholder image',
  tasl: {
    sourceName: 'Unknown',
  },
};

export function transformCaptionedImage(
  frag: {
    image: Image;
    caption: prismic.RichTextField;
    hasRoundedCorners?: boolean;
  },
  crop?: Crop
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
      hasRoundedCorners: false,
    };
  }

  const image = crop ? frag.image[crop] : frag.image;
  return {
    image: transformImage(image) || placeHolderImage,
    caption: asRichText(frag.caption) || [],
    hasRoundedCorners: Boolean(frag.hasRoundedCorners),
  };
}

export function transformPromoToCaptionedImage(
  frag: PromoSliceZone,
  crop?: Crop
): CaptionedImage | undefined {
  // We could do more complicated checking here, but this is what we always use.
  if (frag.length > 0) {
    const promo = frag[0]!;
    return transformCaptionedImage(promo.primary, crop);
  } else {
    return undefined;
  }
}

// We intentionally omit the alt text on promos, so screen reader
// users don't have to listen to the alt text before hearing the
// title of the item in the list.
//
// This is a named constant we can mix in when we want to omit alt
// text, so we only have to write this parent comment once, and not
// copy it everywhere.  e.g.
//
//      promo = { ...promo, ...noAltTextBecausePromo }
//
// See https://github.com/wellcomecollection/wellcomecollection.org/issues/6007
export const noAltTextBecausePromo = {
  alt: null,
};

// null is valid to use the default image,
// which isn't on a property, but rather at the root
export function transformImagePromo(
  zone: PromoSliceZone,
  cropType: Crop | null = '16:9'
): ImagePromo | undefined {
  const promoSlice =
    zone &&
    zone.find((slice: prismic.Slice) => slice.slice_type === 'editorialImage');
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
