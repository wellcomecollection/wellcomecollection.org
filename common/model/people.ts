import { ImageType } from './image';
import { SameAs } from './same-as';
import { HTMLString } from '../services/prismic/types';

export type Person = {
  id: string;
  name: string;
  twitterHandle: string | null;
  description: HTMLString | null;
  image: ImageType;
  sameAs: SameAs;
};
