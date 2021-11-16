import { RTHeading1Node, TimestampField } from '@prismicio/types';
import { Body } from './body';

type Promo = unknown;

export type SeasonPrismicDocument = {
  title: [RTHeading1Node];
  start: TimestampField;
  end: TimestampField;
  body: Body;
  promo: Promo;
};
