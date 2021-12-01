import { TimestampField, PrismicDocument } from '@prismicio/types';
import { CommonPrismicData } from './types';

const typeEnum = 'seasons';

export type SeasonPrismicDocument = PrismicDocument<
  {
    start: TimestampField;
    end: TimestampField;
  } & CommonPrismicData,
  typeof typeEnum
>;
