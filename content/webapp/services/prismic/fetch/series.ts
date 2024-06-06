import { fetcher } from '.';
import {
  commonPrismicFieldsFetchLinks,
  contributorFetchLinks,
  seasonsFetchLinks,
  seriesFetchLinks,
} from '../types';
import { SeriesDocument } from '@weco/common/prismicio-types';

const fetchLinks = [
  ...commonPrismicFieldsFetchLinks,
  ...contributorFetchLinks,
  ...seasonsFetchLinks,
  ...seriesFetchLinks,
];

const seriesFetcher = fetcher<SeriesDocument>('series', fetchLinks);

export const fetchSeriesById = seriesFetcher.getById;
export const fetchSeries = seriesFetcher.getByType;
