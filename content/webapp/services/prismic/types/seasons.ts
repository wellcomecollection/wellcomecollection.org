import * as prismic from '@prismicio/client';
import { CommonPrismicFields } from '.';

const typeEnum = 'seasons';

export type SeasonPrismicDocument = prismic.PrismicDocument<
  {
    start: prismic.TimestampField;
    end: prismic.TimestampField;
  } & CommonPrismicFields,
  typeof typeEnum
>;
