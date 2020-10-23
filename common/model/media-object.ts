import { HTMLString } from '../services/prismic/types';
import { ImageType } from './image';

export type MediaObjectType = {
  id: string,
  title: string | null,
  text: HTMLString | null,
  image: ImageType | null,
};