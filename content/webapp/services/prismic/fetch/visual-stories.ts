import { GetServerSidePropsPrismicClient, fetcher } from '.';
import {
  commonPrismicFieldsFetchLinks,
  contributorFetchLinks,
  eventsFetchLinks,
  exhibitionsFetchLinks,
  teamsFetchLinks,
} from '@weco/content/services/prismic/types';
import * as prismic from '@prismicio/client';
import { VisualStoriesDocument as RawVisualStoriesDocument } from '@weco/common/prismicio-types';

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

export const fetchVisualStory = visualStoriesFetcher.getById;
