import { TimestampField, PrismicDocument } from '@prismicio/types';
import { CommonPrismicFields } from '.';

const typeEnum = 'seasons';

export type SeasonPrismicDocument = PrismicDocument<
  {
    start: TimestampField;
    end: TimestampField;
  } & CommonPrismicFields,
  typeof typeEnum
>;
