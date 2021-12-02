import { fetcher } from '.';
import { EventSeriesPrismicDocument } from '../event-series';

const fetchLinks = [];

const eventSeriesFetcher = fetcher<EventSeriesPrismicDocument>(
  'event-series',
  fetchLinks
);

export const fetchEventSeriesById = eventSeriesFetcher.getById;
export const fetchEventSeries = eventSeriesFetcher.getByType;
export const fetchEventSeriesClientSide =
  eventSeriesFetcher.getByTypeClientSide;
