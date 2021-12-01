import { GetServerSidePropsPrismicClient } from '.';
import { SeasonPrismicDocument } from '../seasons';

export async function getSeason(
  { client }: GetServerSidePropsPrismicClient,
  id: string
): Promise<SeasonPrismicDocument | undefined> {
  const document = await client.getByID<SeasonPrismicDocument>(id);

  if (document.type === 'seasons') {
    return document;
  }
}
