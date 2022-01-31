import * as prismic from 'prismic-client-beta';
import { fetcher, GetServerSidePropsPrismicClient } from '.';
import { PagePrismicDocument } from '../types/pages';
import {
  articleSeriesFields,
  pagesFields,
  collectionVenuesFields,
  eventSeriesFields,
  exhibitionFields,
  teamsFields,
  eventsFields,
  cardsFields,
  eventFormatsFields,
  articleFormatsFields,
  labelsFields,
  seasonsFields,
  contributorsFields,
  peopleFields,
  bookFields,
  pagesFormatsFields,
  guidesFields,
} from '@weco/common/services/prismic/fetch-links';

const fetchLinks = pagesFields.concat(
  articleSeriesFields,
  eventSeriesFields,
  collectionVenuesFields,
  exhibitionFields,
  teamsFields,
  eventsFields,
  cardsFields,
  eventFormatsFields,
  articleFormatsFields,
  labelsFields,
  seasonsFields,
  contributorsFields,
  peopleFields,
  bookFields,
  pagesFormatsFields,
  guidesFields
);

/** Although these are three different document types in Prismic, they all get
 * rendered (and fetched) by the same component.
 */
const pagesFetcher = fetcher<PagePrismicDocument>(
  ['pages', 'guides', 'projects'],
  fetchLinks
);

export const fetchPage = pagesFetcher.getById;
export const fetchPages = pagesFetcher.getByType;
export const fetchPagesClientSide = pagesFetcher.getByTypeClientSide;

export const fetchChildren = async (
  client: GetServerSidePropsPrismicClient,
  pageId: string
): Promise<PagePrismicDocument[]> => {
  const predicates = [prismic.predicate.at('my.pages.parents.parent', pageId)];

  try {
    return await fetchPages(client, { predicates }).then(q => q.results);
  } catch (e) {
    console.warn(`Error trying to fetch children on page ${pageId}: ${e}`);
    return [];
  }
};
