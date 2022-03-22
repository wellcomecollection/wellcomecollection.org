import { Crop, Image, PromoSliceZone } from '../types';
import { RichTextField } from '@prismicio/types';
import { CaptionedImage } from '@weco/common/model/captioned-image';
import isEmptyObj from '@weco/common/utils/is-empty-object';
import { ImageType } from '@weco/common/model/image';
import { ImagePromo } from '../../../types/image-promo';
import { asRichText, asText } from '.';
import * as prismicT from '@prismicio/types';
import { transformImage } from '@weco/common/services/prismic/transformers/images';

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

export function transformCaptionedImage(
  frag: { image: Image; caption: RichTextField },
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
    };
  }

  const image = crop ? frag.image[crop] : frag.image;
  return {
    image: transformImage(image) || placeHolderImage,
    caption: asRichText(frag.caption) || [],
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

// null is valid to use the default image,
// which isn't on a property, but rather at the root
export function transformImagePromo(
  zone: PromoSliceZone,
  cropType: Crop | null = '16:9'
): ImagePromo | undefined {
  const promoSlice =
    zone &&
    zone.find((slice: prismicT.Slice) => slice.slice_type === 'editorialImage');
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
