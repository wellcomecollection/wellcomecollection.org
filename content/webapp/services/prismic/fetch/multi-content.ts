import { GetServerSidePropsPrismicClient, delistPredicate } from '.';
import { Query } from '@prismicio/types';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  MultiContentPrismicDocument,
  StructuredSearchQuery,
} from '../types/multi-content';
import * as prismic from '@prismicio/client';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import { MultiContent } from '../../../types/multi-content';
import superjson from 'superjson';
import {
  contributorFetchLinks,
  exhibitionFormatsFetchLinks,
  exhibitionsFetchLinks,
} from '../types';
import { placesFetchLinks } from '../types/places';
import { teamsFetchLinks } from '../types/teams';
import {
  audienceFetchLinks,
  eventFormatFetchLinks,
  eventPolicyFetchLinks,
  interpretationTypeFetchLinks,
} from '../types/events';
import { pagesFetchLinks } from '../types/pages';
import { seriesFetchLinks } from '../types/series';
import { articlesFetchLinks } from '../types/articles';

export const fetchMultiContent = async (
  { client }: GetServerSidePropsPrismicClient,
  structuredSearchQuery: StructuredSearchQuery
): Promise<Query<MultiContentPrismicDocument>> => {
  const { types, type, id, ids, tags, tag, pageSize, orderings } =
    structuredSearchQuery;

  const idsPredicate =
    ids.length > 0 ? prismic.predicate.at('document.id', ids) : undefined;
  const idPredicate =
    id.length > 0 ? prismic.predicate.in('document.id', id) : undefined;
  const tagsPredicate =
    tags.length > 0 ? prismic.predicate.at('document.tags', tags) : undefined;
  const tagPredicate =
    tag.length > 0 ? prismic.predicate.any('document.tags', tag) : undefined;
  const typesPredicate =
    types.length > 0 ? prismic.predicate.in('document.type', types) : undefined;
  const typePredicate =
    type.length > 0 ? prismic.predicate.any('document.type', type) : undefined;

  // content type specific
  const articleSeries = structuredSearchQuery['article-series'];
  const articleSeriesPredicate =
    articleSeries.length > 0
      ? prismic.predicate.any('my.articles.series.series', articleSeries)
      : undefined;

  const predicates = [
    idsPredicate,
    idPredicate,
    tagsPredicate,
    tagPredicate,
    typesPredicate,
    typePredicate,
    articleSeriesPredicate,
    delistPredicate,
  ].filter(isNotUndefined);

  return client.get<MultiContentPrismicDocument>({
    fetchLinks: [
      ...pagesFetchLinks,
      ...interpretationTypeFetchLinks,
      ...placesFetchLinks,
      ...eventFormatFetchLinks,
      ...eventPolicyFetchLinks,
      ...audienceFetchLinks,
      ...seriesFetchLinks,
      ...exhibitionFormatsFetchLinks,
      ...exhibitionsFetchLinks,
      ...contributorFetchLinks,
      ...teamsFetchLinks,
      ...articlesFetchLinks,
    ],
    predicates,
    pageSize: pageSize || 100,
    orderings: orderings || [],
  });
};

export const fetchMultiContentClientSide = async (
  stringQuery: string
): Promise<PaginatedResults<MultiContent> | undefined> => {
  // If you add more parameters here, you have to update the corresponding cache behaviour
  // in the CloudFront distribution, or you may get incorrect behaviour.
  //
  // e.g. at one point we forgot to include the "params" query in the cache key,
  // so every article was showing the same set of related stories.
  //
  // See https://github.com/wellcomecollection/wellcomecollection.org/issues/7461
  const urlSearchParams = new URLSearchParams();
  urlSearchParams.set('params', stringQuery);

  // If we have multiple content types, use the first one as the ID.
  const url = `/api/multi-content?${urlSearchParams.toString()}`;

  const response = await fetch(url);

  if (response.ok) {
    const json = await response.text();
    return superjson.parse<PaginatedResults<MultiContent>>(json);
  }
};