import * as prismic from '@prismicio/client';
import { fetcher, GetServerSidePropsPrismicClient } from '.';
import {
  pageFormatsFetchLinks,
  pagesFetchLinks,
} from '../types/pages';
import { labelsFields } from '../fetch-links';
import { Page } from '../../../types/pages';
import { SiblingsGroup } from '../../../types/siblings-group';
import {
  articleFormatsFetchLinks,
  contributorFetchLinks,
  eventSeriesFetchLinks,
  exhibitionFormatsFetchLinks,
  exhibitionsFetchLinks,
  projectFormatsFetchLinks,
  seasonsFetchLinks,
} from '../types';
import { teamsFetchLinks } from '../types/teams';
import { eventFormatFetchLinks, eventsFetchLinks } from '../types/events';
import { collectionVenuesFetchLinks } from '../types/collection-venues';
import { bookFetchLinks } from '../types/books';
import { seriesFetchLinks } from '../types/series';
import { cardFetchLinks } from '../types/card';
import { guideFetchLinks, guideFormatsFetchLinks } from '../types/guides';
import { PagesDocument } from '@weco/common/prismicio-types';

export const fetchLinks = [
  ...pagesFetchLinks,
  ...seriesFetchLinks,
  ...eventSeriesFetchLinks,
  ...collectionVenuesFetchLinks,
  ...exhibitionFormatsFetchLinks,
  ...exhibitionsFetchLinks,
  ...teamsFetchLinks,
  ...eventsFetchLinks,
  ...cardFetchLinks,
  ...eventFormatFetchLinks,
  ...articleFormatsFetchLinks,
  ...labelsFields,
  ...seasonsFetchLinks,
  ...contributorFetchLinks,
  ...bookFetchLinks,
  ...pageFormatsFetchLinks,
  ...guideFormatsFetchLinks,
  ...projectFormatsFetchLinks,
  ...guideFetchLinks,
];

/** Although these are three different document types in Prismic, they all get
 * rendered (and fetched) by the same component.
 */
const pagesFetcher = fetcher<PagesDocument>(
  ['pages', 'guides', 'projects'],
  fetchLinks
);

export const fetchPage = pagesFetcher.getById;
export const fetchPages = pagesFetcher.getByType;

export const fetchChildren = async (
  client: GetServerSidePropsPrismicClient,
  page: Page
): Promise<PagesDocument[]> => {
  const filters = [prismic.filter.at('my.pages.parents.parent', page.id)];

  try {
    const pages = await fetchPages(client, { filters });
    return pages.results;
  } catch (e) {
    console.warn(`Error trying to fetch children on page ${page.id}: ${e}`);
    return [];
  }
};

export const fetchSiblings = async (
  client: GetServerSidePropsPrismicClient,
  page: Page
): Promise<SiblingsGroup<PagesDocument>[]> => {
  const relatedPagePromises = page.parentPages?.map(parentPage =>
    fetchChildren(client, parentPage)
  );
  const relatedPages = await Promise.all(relatedPagePromises ?? []);

  return relatedPages.map((results, i) => {
    return {
      id: page.parentPages[i].id,
      title: page.parentPages[i].title,
      siblings: results.filter(sibling => sibling.id !== page.id),
    };
  });
};
