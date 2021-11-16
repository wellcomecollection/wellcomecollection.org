import { RTHeading1Node, TimestampField } from '@prismicio/types';
import { Promo } from './prismic';
import { Body } from './prismic-body';

export type SeasonPrismicDocument = {
  title: [RTHeading1Node];
  start: TimestampField;
  end: TimestampField;
  body: Body;
  promo: Promo;
};
