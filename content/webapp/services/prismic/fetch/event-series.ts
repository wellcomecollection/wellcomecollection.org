import { fetcher } from '.';
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

export const fetchEventSeriesById = eventSeriesFetcher.getById;
export const fetchEventSeries = eventSeriesFetcher.getByType;
