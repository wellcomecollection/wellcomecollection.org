import * as prismic from '@prismicio/client';

import { ImageType } from './image';

export type CaptionedImage = {
  caption: prismic.RichTextField;
  image: ImageType;
  hasRoundedCorners: boolean;
  isZoomable?: boolean;
};
