import {
  KeyTextField,
  RichTextField,
  Slice,
  SliceZone,
} from '@prismicio/types';
import { Image } from './image';

export type Promo = SliceZone<
  Slice<
    'editorialImage',
    { caption: RichTextField; image: Image; text: KeyTextField }
  >
>;
