import { fetcher } from '.';
import { commonPrismicFieldsFetchLinks, contributorFetchLinks } from '../types';
import { cardFetchLinks } from '../types/card';
import { EventSeriesDocument } from '@weco/common/prismicio-types';

const fetchLinks = [
  ...commonPrismicFieldsFetchLinks,
  ...contributorFetchLinks,
  ...cardFetchLinks,
] as string[];

const eventSeriesFetcher = fetcher<EventSeriesDocument>(
  'event-series',
  fetchLinks
);

export const fetchEventSeriesById = eventSeriesFetcher.getById;
export const fetchEventSeries = eventSeriesFetcher.getByType;
