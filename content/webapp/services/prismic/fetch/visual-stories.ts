import { GetServerSidePropsPrismicClient, fetcher } from '.';
import {
  commonPrismicFieldsFetchLinks,
  contributorFetchLinks,
  eventsFetchLinks,
  exhibitionsFetchLinks,
  teamsFetchLinks,
} from '@weco/content/services/prismic/types';
import { VisualStoriesDocument } from '@weco/common/prismicio-types';
import * as prismic from '@prismicio/client';

const fetchLinks = [
  ...commonPrismicFieldsFetchLinks,
  ...teamsFetchLinks,
  ...contributorFetchLinks,
  ...exhibitionsFetchLinks,
  ...eventsFetchLinks,
];

const visualStoriesFetcher = fetcher<VisualStoriesDocument>(
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
): Promise<prismic.Query<VisualStoriesDocument>> => {
  return visualStoriesFetcher.getByType(
    client,
    {
      filters,
      page: 1,
    },
    hasDelistFilter
  );
};

export const fetchVisualStory = visualStoriesFetcher.getById;
