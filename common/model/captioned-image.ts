import { ImageType } from './image';
import * as prismicT from '@prismicio/types';

export type CaptionedImage = {
  caption: prismicT.RichTextField;
  image: ImageType;
  hasRoundedCorners: boolean;
};
