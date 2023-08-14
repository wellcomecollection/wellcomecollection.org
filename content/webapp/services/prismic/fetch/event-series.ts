import { fetcher } from '.';
import { commonPrismicFieldsFetchLinks, contributorFetchLinks } from '../types';
import { EventSeriesPrismicDocument } from '../types/event-series';
import { cardFetchLinks } from '../types/card';

const fetchLinks = [
  ...commonPrismicFieldsFetchLinks,
  ...contributorFetchLinks,
  ...cardFetchLinks,
];

const eventSeriesFetcher = fetcher<EventSeriesPrismicDocument>(
  'event-series',
  fetchLinks
);

export const fetchEventSeriesById = eventSeriesFetcher.getById;
export const fetchEventSeries = eventSeriesFetcher.getByType;
