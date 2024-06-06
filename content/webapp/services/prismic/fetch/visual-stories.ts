import { GetServerSidePropsPrismicClient, fetcher } from '.';
import {
  commonPrismicFieldsFetchLinks,
  contributorFetchLinks,
  teamsFetchLinks,
} from '@weco/content/services/prismic/types';
import * as prismic from '@prismicio/client';
import { VisualStoriesDocument } from '@weco/common/prismicio-types';

const fetchLinks = [
  ...commonPrismicFieldsFetchLinks,
  ...teamsFetchLinks,
  ...contributorFetchLinks,
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
