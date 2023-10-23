import { GetServerSidePropsPrismicClient, fetcher } from '.';
import { commonPrismicFieldsFetchLinks, contributorFetchLinks } from '../types';
import { VisualStoryDocument } from '../types/visual-stories';
import { teamsFetchLinks } from '../types/teams';
import * as prismic from '@prismicio/client';

const fetchLinks = [
  ...commonPrismicFieldsFetchLinks,
  ...teamsFetchLinks,
  ...contributorFetchLinks,
];

const visualStoriesFetcher = fetcher<VisualStoryDocument>(
  'visual-stories',
  fetchLinks
);

type GetVisualStoriesProps = {
  filters?: string[];
  page?: number;
  hasDelistFilter?: boolean;
};

export const fetchVisualStories = (
  client: GetServerSidePropsPrismicClient,
  { filters = [], page = 1, hasDelistFilter = true }: GetVisualStoriesProps = {}
): Promise<prismic.Query<VisualStoryDocument>> => {
  return visualStoriesFetcher.getByType(
    client,
    {
      filters,
      page,
      orderings: {
        field: 'document.first_publication_date',
        direction: 'desc',
      },
    },
    hasDelistFilter
  );
};

export const fetchVisualStory = visualStoriesFetcher.getById;
