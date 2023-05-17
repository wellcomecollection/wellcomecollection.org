import {
  GetServerSidePropsPrismicClient,
  delistPredicate,
  fetchFromClientSide,
} from '.';
import { Query } from '@prismicio/client';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  MultiContentPrismicDocument,
  StructuredSearchQuery,
} from '../types/multi-content';
import * as prismic from '@prismicio/client';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import { MultiContent } from '../../../types/multi-content';
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
): Promise<PaginatedResults<MultiContent> | undefined> =>
  fetchFromClientSide({ endpoint: 'multi-content', params: stringQuery });
