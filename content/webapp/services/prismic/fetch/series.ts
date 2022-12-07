import { fetcher } from '.';
import {
  commonPrismicFieldsFetchLinks,
  contributorFetchLinks,
  seasonsFetchLinks,
} from '../types';
import { SeriesPrismicDocument, seriesFetchLinks } from '../types/series';

const fetchLinks = [
  ...commonPrismicFieldsFetchLinks,
  ...contributorFetchLinks,
  ...seasonsFetchLinks,
  ...seriesFetchLinks,
];

const seriesFetcher = fetcher<SeriesPrismicDocument>('series', fetchLinks);

export const fetchSeriesById = seriesFetcher.getById;
export const fetchSeries = seriesFetcher.getByType;
