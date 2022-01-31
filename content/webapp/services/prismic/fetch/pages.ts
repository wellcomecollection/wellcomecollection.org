import { Query } from '@prismicio/types';
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

export const fetchChildren = (
  client: GetServerSidePropsPrismicClient,
  pageId: string
): Promise<Query<PagePrismicDocument>> => {
  const predicates = [prismic.predicate.at('my.pages.parents.parent', pageId)];

  return fetchPages(client, {
    predicates,
  });
};
