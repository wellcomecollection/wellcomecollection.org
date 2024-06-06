import * as prismic from '@prismicio/client';
import { fetcher, GetByTypeParams, GetServerSidePropsPrismicClient } from '.';
import { ExhibitionGuidesDocument } from '@weco/common/prismicio-types';
import { exhibitionsFetchLinks, contributorFetchLinks } from '../types';

const fetchLinks = [...exhibitionsFetchLinks, ...contributorFetchLinks];

const exhibitionGuidesFetcher = fetcher<ExhibitionGuidesDocument>(
  'exhibition-guides',
  fetchLinks
);

export const fetchExhibitionGuide = exhibitionGuidesFetcher.getById;

export const fetchExhibitionGuides = (
  client: GetServerSidePropsPrismicClient,
  { ...opts }: GetByTypeParams
): Promise<prismic.Query<ExhibitionGuidesDocument>> => {
  return exhibitionGuidesFetcher.getByType(client, {
    fetchLinks,
    ...opts,
  });
};
