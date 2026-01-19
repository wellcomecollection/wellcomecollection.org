import * as prismic from '@prismicio/client';

import { ExhibitionGuidesDocument as RawExhibitionGuidesDocument } from '@weco/common/prismicio-types';
import {
  contributorFetchLinks,
  exhibitionsFetchLinks,
} from '@weco/content/services/prismic/types';

import { fetcher, GetByTypeParams, GetServerSidePropsPrismicClient } from '.';

const fetchLinks = [...exhibitionsFetchLinks, ...contributorFetchLinks];

const exhibitionGuidesFetcher = fetcher<RawExhibitionGuidesDocument>(
  'exhibition-guides',
  fetchLinks
);

export const fetchExhibitionGuide = async (
  client: GetServerSidePropsPrismicClient,
  id: string
): Promise<RawExhibitionGuidesDocument | undefined> => {
  const exhibitionGuideDocument =
    (await exhibitionGuidesFetcher.getByUid(client, id)) ||
    (await exhibitionGuidesFetcher.getById(client, id));

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
