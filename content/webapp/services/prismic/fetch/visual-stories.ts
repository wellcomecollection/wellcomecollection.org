import { fetcher } from '.';
import { commonPrismicFieldsFetchLinks, contributorFetchLinks } from '../types';
import { VisualStoryDocument } from '../types/visual-stories';
import { teamsFetchLinks } from '../types/teams';

const fetchLinks = [
  ...commonPrismicFieldsFetchLinks,
  ...teamsFetchLinks,
  ...contributorFetchLinks,
];

const visualStoriesFetcher = fetcher<VisualStoryDocument>(
  'visual-stories',
  fetchLinks
);

export const fetchVisualStory = visualStoriesFetcher.getById;
export const fetchVisualStories = visualStoriesFetcher.getByType;
