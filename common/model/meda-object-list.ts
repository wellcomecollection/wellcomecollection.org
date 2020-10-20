import { HTMLString } from '../services/prismic/types';
import { ImageType } from './image';

export type MediaObjectType = {
  title: string,
  text: HTMLString | null,
  image: ImageType | null,
};
