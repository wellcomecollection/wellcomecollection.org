import { Query } from '@prismicio/client';
import { fetcher, GetByTypeParams, GetServerSidePropsPrismicClient } from '.';
import { ExhibitionGuidePrismicDocument } from '../types/exhibition-guides';
import { exhibitionsFetchLinks, contributorFetchLinks } from '../types';

const fetchLinks = [...exhibitionsFetchLinks, ...contributorFetchLinks];

const exhibitionGuidesFetcher = fetcher<ExhibitionGuidePrismicDocument>(
  'exhibition-guides',
  fetchLinks
);

export const fetchExhibitionGuide = exhibitionGuidesFetcher.getById;

export const fetchExhibitionGuides = (
  client: GetServerSidePropsPrismicClient,
  { ...opts }: GetByTypeParams
): Promise<Query<ExhibitionGuidePrismicDocument>> => {
  return exhibitionGuidesFetcher.getByType(client, {
    fetchLinks,
    ...opts,
  });
};
