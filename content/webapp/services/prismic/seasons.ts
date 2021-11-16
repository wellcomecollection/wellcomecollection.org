import {
  KeyTextField,
  RichTextField,
  RTHeading1Node,
  Slice,
  SliceZone,
  TimestampField,
} from '@prismicio/types';
import { Image } from './image';
import { Body } from './body';

type Promo = SliceZone<
  Slice<
    'editorialImage',
    { caption: RichTextField; image: Image; text: KeyTextField }
  >
>;

export type SeasonPrismicDocument = {
  title: [RTHeading1Node];
  start: TimestampField;
  end: TimestampField;
  body: Body;
  promo: Promo;
};
