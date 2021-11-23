import { TimestampField, PrismicDocument } from '@prismicio/types';
import { GetServerSidePropsPrismicClient } from './client';
import { CommonPrismicData } from './types';

export type SeasonPrismicDocument = PrismicDocument<
  {
    start: TimestampField;
    end: TimestampField;
  } & CommonPrismicData
>;

export async function getSeason(
  { client }: GetServerSidePropsPrismicClient,
  id: string
): Promise<SeasonPrismicDocument | undefined> {
  const document = await client.getByID<SeasonPrismicDocument>(id);

  if (document.type === 'seasons') {
    return document;
  }
}
