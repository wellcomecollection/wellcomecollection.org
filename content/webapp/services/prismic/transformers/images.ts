import { Image } from '../types';
import { RichTextField } from '@prismicio/types';
import { CaptionedImage } from '@weco/common/model/captioned-image';
import isEmptyObj from '@weco/common/utils/is-empty-object';
import { ImageType } from '@weco/common/model/image';
import {
  parseImage,
  isEmptyHtmlString,
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
