import { Query } from '@prismicio/types';
import { fetcher, GetByTypeParams, GetServerSidePropsPrismicClient } from '.';
import { DigitalGuidePrismicDocument } from '../types/digital-guides';
import { exhibitionsFetchLinks, contributorFetchLinks } from '../types';

const fetchLinks = [...exhibitionsFetchLinks, ...contributorFetchLinks];

const digitalGuidesFetcher = fetcher<DigitalGuidePrismicDocument>(
  'digital-guides',
  fetchLinks
);

export const fetchDigitalGuide = digitalGuidesFetcher.getById;

export const fetchDigitalGuides = (
  client: GetServerSidePropsPrismicClient,
  { ...opts }: GetByTypeParams
): Promise<Query<DigitalGuidePrismicDocument>> => {
  return digitalGuidesFetcher.getByType(client, {
    fetchLinks,
    ...opts,
  });
};
