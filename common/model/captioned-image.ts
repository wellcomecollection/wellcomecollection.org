import { ImageType } from './image';
import { HTMLString } from '../services/prismic/types';

export type CaptionedImage = {
  caption: HTMLString;
  image: ImageType;
};
