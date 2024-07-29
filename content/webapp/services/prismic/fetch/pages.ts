import * as prismic from '@prismicio/client';
import { fetcher, GetServerSidePropsPrismicClient } from '.';
import {
  pageFormatsFetchLinks,
  articleFormatsFetchLinks,
  bookFetchLinks,
  cardFetchLinks,
  collectionVenuesFetchLinks,
  contributorFetchLinks,
  eventsFetchLinks,
  eventFormatFetchLinks,
  eventSeriesFetchLinks,
  exhibitionFormatsFetchLinks,
  exhibitionsFetchLinks,
  guideFetchLinks,
  guideFormatsFetchLinks,
  pagesFetchLinks,
  projectFormatsFetchLinks,
  seasonsFetchLinks,
  seriesFetchLinks,
  teamsFetchLinks,
} from '@weco/content/services/prismic/types';
import { PagesDocument as RawPagesDocument } from '@weco/common/prismicio-types';
import { labelsFields } from '../fetch-links';
import { Page } from '../../../types/pages';
import { SiblingsGroup } from '../../../types/siblings-group';

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
const pagesFetcher = fetcher<RawPagesDocument>(
  ['pages', 'guides', 'projects'],
  fetchLinks
);

// Get by uid can't take an array as the type
const guidesUidFetcher = fetcher<RawPagesDocument>('guides', fetchLinks);
// const pagesUidFetcher = fetcher<RawPagesDocument>('pages', fetchLinks);
// const projectsUidFetcher = fetcher<RawPagesDocument>('projects', fetchLinks);

export const fetchPage = pagesFetcher.getById;
export const fetchPages = pagesFetcher.getByType;

export const fetchGuideByUID = guidesUidFetcher.getByUid; // TODO type
// export const fetchPageByUID = pagesUidFetcher.getByUid;
// export const fetchprojectByUID = projectsUidFetcher.getByUid;

export const fetchChildren = async (
  client: GetServerSidePropsPrismicClient,
  page: Page
): Promise<RawPagesDocument[]> => {
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
): Promise<SiblingsGroup<RawPagesDocument>[]> => {
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
