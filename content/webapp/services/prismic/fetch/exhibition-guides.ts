import * as prismic from '@prismicio/client';
import { fetcher, GetByTypeParams, GetServerSidePropsPrismicClient } from '.';
import { ExhibitionGuidesDocument as RawExhibitionGuidesDocument } from '@weco/common/prismicio-types';
import {
  exhibitionsFetchLinks,
  contributorFetchLinks,
} from '@weco/content/services/prismic/types';

const fetchLinks = [...exhibitionsFetchLinks, ...contributorFetchLinks];

const exhibitionGuidesFetcher = fetcher<RawExhibitionGuidesDocument>(
  'exhibition-guides',
  fetchLinks
);

export const fetchExhibitionGuide = async (
  client: GetServerSidePropsPrismicClient,
  id: string
): Promise<RawExhibitionGuidesDocument | undefined> => {
  // TODO once redirects are in place we should only fetch by uid
  const exhibitionGuideDocument =
    (await exhibitionGuidesFetcher.getById(client, id)) ||
    (await exhibitionGuidesFetcher.getByUid(client, id));

  return exhibitionGuideDocument;
};

export const fetchExhibitionGuides = (
  client: GetServerSidePropsPrismicClient,
  { ...opts }: GetByTypeParams
): Promise<prismic.Query<RawExhibitionGuidesDocument>> => {
  return exhibitionGuidesFetcher.getByType(client, {
    fetchLinks,
    ...opts,
  });
};
