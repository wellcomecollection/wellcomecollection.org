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
import {
  GuidesDocument as RawGuidesDocument,
  PagesDocument as RawPagesDocument,
  ProjectsDocument as RawProjectsDocument,
} from '@weco/common/prismicio-types';
import { labelsFields } from '@weco/content/services/prismic/fetch-links';
import { Page } from '@weco/content/types/pages';
import { SiblingsGroup } from '@weco/content/types/siblings-group';

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

type PagesContentTypes =
  | RawPagesDocument
  | RawProjectsDocument
  | RawGuidesDocument;

export const fetchPages = pagesFetcher.getByType;
export const fetchPage = async (
  client: GetServerSidePropsPrismicClient,
  id: string,
  contentType: 'pages' | 'guides' | 'projects'
): Promise<PagesContentTypes | undefined> => {
  // TODO once redirects are in place we should only fetch by uid
  const pageDocument =
    (await pagesFetcher.getById(client, id)) ||
    (await fetcher<PagesContentTypes>(contentType, fetchLinks).getByUid(
      client,
      id
    ));

  return pageDocument;
};

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
