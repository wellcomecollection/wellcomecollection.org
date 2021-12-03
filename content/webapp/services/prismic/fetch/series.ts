import { GetServerSidePropsPrismicClient } from '.';
import { SeriesPrismicDocument } from '../series';

export async function fetchSeries(
  { client }: GetServerSidePropsPrismicClient,
  id: string
): Promise<SeriesPrismicDocument | undefined> {
  const document = await client.getByID<SeriesPrismicDocument>(id);

  if (document.type === 'series') {
    return document;
  }
}

export async function fetchSeriesClientSide(
  id: string
): Promise<SeriesPrismicDocument | undefined> {
  const response = await fetch(`/api/series/${id}`);
  if (response.ok) {
    return response.json();
  }
}
