import { EventSeriesDocument as RawEventSeriesDocument } from '@weco/common/prismicio-types';
import {
  cardFetchLinks,
  commonPrismicFieldsFetchLinks,
  contributorFetchLinks,
} from '@weco/content/services/prismic/types';

import { fetcher, GetServerSidePropsPrismicClient } from '.';

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
  // #11240 once redirects are in place we should only fetch by uid
  const eventDocumentById =
    (await eventSeriesFetcher.getByUid(client, id)) ||
    (await eventSeriesFetcher.getById(client, id));
  return eventDocumentById;
};

export const fetchEventSeries = eventSeriesFetcher.getByType;
