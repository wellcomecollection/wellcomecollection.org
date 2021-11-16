import { RTHeading1Node, TimestampField } from '@prismicio/types';
import { Body } from './body';
import { Promo } from './promo';

export type SeasonPrismicDocument = {
  title: [RTHeading1Node];
  start: TimestampField;
  end: TimestampField;
  body: Body;
  promo: Promo;
};
