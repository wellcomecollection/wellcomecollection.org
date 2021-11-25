import { TimestampField, PrismicDocument } from '@prismicio/types';
import { GetServerSidePropsPrismicClient } from './client';
import { CommonPrismicData } from './types';

const typeEnum = 'seasons';

export type SeasonPrismicDocument = PrismicDocument<
  {
    start: TimestampField;
    end: TimestampField;
  } & CommonPrismicData,
  typeof typeEnum
>;

export async function getSeason(
  { client }: GetServerSidePropsPrismicClient,
  id: string
): Promise<SeasonPrismicDocument | undefined> {
  const document = await client.getByID<SeasonPrismicDocument>(id);

  if (document.type === typeEnum) {
    return document;
  }
}
