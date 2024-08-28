import { GetServerSidePropsPrismicClient, fetcher } from '.';
import {
  commonPrismicFieldsFetchLinks,
  contributorFetchLinks,
  seasonsFetchLinks,
  seriesFetchLinks,
} from '../types';
import { SeriesDocument as RawSeriesDocument } from '@weco/common/prismicio-types';

const fetchLinks = [
  ...commonPrismicFieldsFetchLinks,
  ...contributorFetchLinks,
  ...seasonsFetchLinks,
  ...seriesFetchLinks,
];

const seriesFetcher = fetcher<RawSeriesDocument>('series', fetchLinks);

export const fetchSeries = seriesFetcher.getByType;

export const fetchSeriesById = async (
  client: GetServerSidePropsPrismicClient,
  id: string
): Promise<RawSeriesDocument | undefined> => {
  // TODO once redirects are in place we should only fetch by uid
  const seriesDocumentById = await seriesFetcher.getById(client, id);
  const seriesDocumentByUID = await seriesFetcher.getByUid(client, id);

  return seriesDocumentById || seriesDocumentByUID;
};
