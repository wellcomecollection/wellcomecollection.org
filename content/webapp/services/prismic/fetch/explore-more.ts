import * as prismic from '@prismicio/client';

import { ExploreMoreDocument } from '@weco/common/prismicio-types';
import {
  articlesFetchLinks,
  seriesFetchLinks,
} from '@weco/content/services/prismic/types';

import { fetcher, GetServerSidePropsPrismicClient } from '.';

const fetchLinks = [...articlesFetchLinks, ...seriesFetchLinks];

const exploreMoreFetcher = fetcher<ExploreMoreDocument>(
  'explore-more',
  fetchLinks
);

export const fetchExploreMore = async (
  client: GetServerSidePropsPrismicClient,
  exhibitionId: string
): Promise<ExploreMoreDocument | undefined> => {
  const query = await exploreMoreFetcher.getByType(client, {
    filters: [
      prismic.filter.at('my.explore-more.related_exhibition', exhibitionId),
    ],
    pageSize: 1,
  });
  return query.results[0];
};
