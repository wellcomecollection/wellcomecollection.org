import * as prismic from '@prismicio/client';

import { PagesDocument as RawPagesDocument } from '@weco/common/prismicio-types';
import { labelsFields } from '@weco/content/services/prismic/fetch-links';
import {
  articleFormatsFetchLinks,
  bookFetchLinks,
  cardFetchLinks,
  collectionVenuesFetchLinks,
  commonPrismicFieldsFetchLinks,
  contributorFetchLinks,
  eventFormatFetchLinks,
  eventSeriesFetchLinks,
  eventsFetchLinks,
  exhibitionFormatsFetchLinks,
  exhibitionsFetchLinks,
  guideFetchLinks,
  guideFormatsFetchLinks,
  pageFormatsFetchLinks,
  pagesFetchLinks,
  projectFormatsFetchLinks,
  seasonsFetchLinks,
  seriesFetchLinks,
  teamsFetchLinks,
} from '@weco/content/services/prismic/types';
import { Page } from '@weco/content/types/pages';
import { SiblingsGroup } from '@weco/content/types/siblings-group';

import { fetcher, GetServerSidePropsPrismicClient } from '.';

export const fetchLinks = [
  ...commonPrismicFieldsFetchLinks,
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
const pagesFetcher = fetcher<RawPagesDocument>(['pages'], fetchLinks);

export const fetchPages = pagesFetcher.getByType;
export const fetchPage = async (
  client: GetServerSidePropsPrismicClient,
  id: string
): Promise<RawPagesDocument | undefined> => {
  // TODO once redirects are in place we should only fetch by uid
  const pageDocument =
    (await pagesFetcher.getByUid(client, id)) ||
    (await pagesFetcher.getById(client, id));

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
