import {
  SeriesDocument as RawSeriesDocument,
  WebcomicSeriesDocument as RawWebcomicSeriesDocument,
} from '@weco/common/prismicio-types';
import {
  commonPrismicFieldsFetchLinks,
  contributorFetchLinks,
  seasonsFetchLinks,
  seriesFetchLinks,
} from '@weco/content/services/prismic/types';

import { fetcher, GetServerSidePropsPrismicClient } from '.';

const fetchLinks = [
  ...commonPrismicFieldsFetchLinks,
  ...contributorFetchLinks,
  ...seasonsFetchLinks,
  ...seriesFetchLinks,
];

const seriesFetcher = (contentType: 'webcomic-series' | 'series') =>
  fetcher<RawSeriesDocument>(contentType, fetchLinks);

export const fetchSeries = seriesFetcher('series').getByType;

export const fetchSeriesById = async (
  client: GetServerSidePropsPrismicClient,
  id: string,
  contentType: 'webcomic-series' | 'series'
): Promise<RawSeriesDocument | RawWebcomicSeriesDocument | undefined> => {
  // TODO once redirects are in place we should only fetch by uid
  const seriesDocument =
    (await seriesFetcher(contentType).getById(client, id)) ||
    (await seriesFetcher(contentType).getByUid(client, id));

  return seriesDocument;
};
