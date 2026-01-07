import * as prismic from '@prismicio/client';

import { VisualStoriesDocument as RawVisualStoriesDocument } from '@weco/common/prismicio-types';
import {
  commonPrismicFieldsFetchLinks,
  contributorFetchLinks,
  eventsFetchLinks,
  exhibitionsFetchLinks,
  teamsFetchLinks,
} from '@weco/content/services/prismic/types';

import { fetcher, GetServerSidePropsPrismicClient } from '.';

const fetchLinks = [
  ...commonPrismicFieldsFetchLinks,
  ...teamsFetchLinks,
  ...contributorFetchLinks,
  ...exhibitionsFetchLinks,
  ...eventsFetchLinks,
];

const visualStoriesFetcher = fetcher<RawVisualStoriesDocument>(
  'visual-stories',
  fetchLinks
);
type GetVisualStoriesProps = {
  filters?: string[];
  hasDelistFilter?: boolean;
};

export const fetchVisualStories = (
  client: GetServerSidePropsPrismicClient,
  { filters = [], hasDelistFilter = true }: GetVisualStoriesProps = {}
): Promise<prismic.Query<RawVisualStoriesDocument>> => {
  return visualStoriesFetcher.getByType(
    client,
    {
      filters,
      page: 1,
    },
    hasDelistFilter
  );
};

export const fetchVisualStory = async (
  client: GetServerSidePropsPrismicClient,
  id: string
): Promise<RawVisualStoriesDocument | undefined> => {
  const visualStoryDocument =
    (await visualStoriesFetcher.getByUid(client, id)) ||
    (await visualStoriesFetcher.getById(client, id));

  return visualStoryDocument;
};
