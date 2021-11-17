import { TimestampField, PrismicDocument } from '@prismicio/types';
import { Client } from 'prismic-client-beta';
import { getDocument } from './api';
import { CommonPrismicData } from './types';

export type SeasonPrismicDocument = PrismicDocument<
  {
    start: TimestampField;
    end: TimestampField;
  } & CommonPrismicData
>;

export function getSeason(client: Client, id: string) {
  const document = getDocument<SeasonPrismicDocument>(client, id);
  return document;
}
