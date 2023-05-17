import {
  GetServerSidePropsPrismicClient,
  delistFilter,
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

  const idsFilter =
    ids.length > 0 ? prismic.filter.at('document.id', ids) : undefined;
  const idFilter =
    id.length > 0 ? prismic.filter.in('document.id', id) : undefined;
  const tagsFilter =
    tags.length > 0 ? prismic.filter.at('document.tags', tags) : undefined;
  const tagFilter =
    tag.length > 0 ? prismic.filter.any('document.tags', tag) : undefined;
  const typesFilter =
    types.length > 0 ? prismic.filter.in('document.type', types) : undefined;
  const typeFilter =
    type.length > 0 ? prismic.filter.any('document.type', type) : undefined;

  // content type specific
  const articleSeries = structuredSearchQuery['article-series'];
  const articleSeriesFilter =
    articleSeries.length > 0
      ? prismic.filter.any('my.articles.series.series', articleSeries)
      : undefined;

  const filters = [
    idsFilter,
    idFilter,
    tagsFilter,
    tagFilter,
    typesFilter,
    typeFilter,
    articleSeriesFilter,
    delistFilter,
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
    filters,
    pageSize: pageSize || 100,
    orderings: orderings || [],
  });
};

export const fetchMultiContentClientSide = async (
  stringQuery: string
): Promise<PaginatedResults<MultiContent> | undefined> =>
  fetchFromClientSide({ endpoint: 'multi-content', params: stringQuery });
