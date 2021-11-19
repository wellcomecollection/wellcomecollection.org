import { TimestampField, PrismicDocument } from '@prismicio/types';
import { Client } from 'prismic-client-beta';
import { CommonPrismicData } from './types';

export type SeasonPrismicDocument = PrismicDocument<
  {
    start: TimestampField;
    end: TimestampField;
  } & CommonPrismicData
>;

export async function getSeason(client: Client, id: string) {
  const document = await client.getByID<SeasonPrismicDocument>(id);

  if (document.type === 'seasons') {
    return document;
  }
}
