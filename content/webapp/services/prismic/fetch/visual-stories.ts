import * as prismic from '@prismicio/client';
import { fetcher, GetServerSidePropsPrismicClient, GetByTypeParams } from '.';
import { commonPrismicFieldsFetchLinks, contributorFetchLinks } from '../types';
import { VisualStoriesDocument } from '../types/visual-stories';
import { teamsFetchLinks } from '../types/teams';

const fetchLinks = [
  ...commonPrismicFieldsFetchLinks,
  ...teamsFetchLinks,
  ...contributorFetchLinks,
];

const visualStoriesFetcher = fetcher<VisualStoriesDocument>(
  'visual-stories',
  fetchLinks
);

export const fetchVisualStory = visualStoriesFetcher.getById;

export const fetchVisualStories = (
  client: GetServerSidePropsPrismicClient,
  params: GetByTypeParams
): Promise<prismic.Query<VisualStoriesDocument>> => {
  return visualStoriesFetcher.getByType(client, {
    ...params,
    orderings: [
      { field: 'my.visual-stories.datePublished', direction: 'desc' },
      { field: 'document.first_publication_date', direction: 'desc' },
    ],
  });
};
