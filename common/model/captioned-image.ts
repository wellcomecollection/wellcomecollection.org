import { ImageType } from './image';
import * as prismic from '@prismicio/client';

export type CaptionedImage = {
  caption: prismic.RichTextField;
  image: ImageType;
  hasRoundedCorners: boolean;
};
