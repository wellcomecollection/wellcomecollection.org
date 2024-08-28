import { GetServerSidePropsPrismicClient, fetcher } from '.';
import {
  cardFetchLinks,
  commonPrismicFieldsFetchLinks,
  contributorFetchLinks,
} from '@weco/content/services/prismic/types';
import { EventSeriesDocument as RawEventSeriesDocument } from '@weco/common/prismicio-types';

const fetchLinks = [
  ...commonPrismicFieldsFetchLinks,
  ...contributorFetchLinks,
  ...cardFetchLinks,
] as string[];

const eventSeriesFetcher = fetcher<RawEventSeriesDocument>(
  'event-series',
  fetchLinks
);

export const fetchEventSeriesById = async (
  client: GetServerSidePropsPrismicClient,
  id: string
): Promise<RawEventSeriesDocument | undefined> => {
  // TODO once redirects are in place we should only fetch by uid
  const eventSeriesDocumentById = await eventSeriesFetcher.getById(client, id);
  const eventSeriesDocumentByUID = await eventSeriesFetcher.getByUid(
    client,
    id
  );

  return eventSeriesDocumentById || eventSeriesDocumentByUID;
};

export const fetchEventSeries = eventSeriesFetcher.getByType;
