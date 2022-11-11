import { fetcher } from '.';
import { commonPrismicFieldsFetchLinks, contributorFetchLinks } from '../types';
import { EventSeriesPrismicDocument } from '../types/event-series';

const fetchLinks = [...commonPrismicFieldsFetchLinks, ...contributorFetchLinks];

const eventSeriesFetcher = fetcher<EventSeriesPrismicDocument>(
  'event-series',
  fetchLinks
);

export const fetchEventSeriesById = eventSeriesFetcher.getById;
export const fetchEventSeries = eventSeriesFetcher.getByType;
