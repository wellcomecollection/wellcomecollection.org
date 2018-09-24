// @flow
// This service is used for getting content of multiple types of content.
import Prismic from 'prismic-javascript';
import {getDocuments} from './api';
import { parsePage } from './pages';
import { parseEventSeries } from './event-series';
import { parseBook } from './books';
import { parseEventDoc } from './events';
import { parseArticle } from './articles';
import { parseInstallationDoc } from './installations';
import {
  pagesFields,
  interpretationTypesFields,
  placesFields,
  eventFormatsFields,
  eventPoliciesFields,
  audiencesFields,
  articleSeriesFields
} from './fetch-links';
import type {MultiContent} from '../../model/multi-content';
import type {StructuredSearchQuery} from './search';
import type {PaginatedResults, PrismicDocument} from './types';

export function parseMultiContent(documents: PrismicDocument[]): MultiContent[] {
  return documents.map(document => {
    switch (document.type) {
      case 'pages':
        return parsePage(document);
      case 'event-series':
        return parseEventSeries(document);
      case 'books':
        return parseBook(document);
      case 'events':
        return parseEventDoc(document);
      case 'articles':
        return parseArticle(document);
      case 'installations':
        return parseInstallationDoc(document);
    }
  }).filter(Boolean);
}

export async function getMultiContent(
  req: Request,
  structuredSearchQuery: StructuredSearchQuery
): Promise<PaginatedResults<MultiContent>> {
  const {types, type, id, ids, tags, tag, pageSize, orderings} = structuredSearchQuery;
  const articleSeries = structuredSearchQuery['article-series'];
  const idsPredicate = ids.length > 0 ? Prismic.Predicates.at('document.id', ids) : null;
  const idPredicate = id.length > 0 ? Prismic.Predicates.in('document.id', id) : null;
  const tagsPredicate = tags.length > 0 ? Prismic.Predicates.at('document.tags', tags) : null;
  const tagPredicate = tag.length > 0 ? Prismic.Predicates.any('document.tags', tag) : null;
  const typesPredicate = types.length > 0 ? Prismic.Predicates.in('document.type', types) : null;
  const typePredicate = type.length > 0 ? Prismic.Predicates.any('document.type', type) : null;
  // content type specific
  const articleSeriesPredicate = articleSeries.length > 0 ? Prismic.Predicates.any('my.articles.series.series', articleSeries) : null;
  const predicates = [
    idsPredicate,
    idPredicate,
    tagsPredicate,
    tagPredicate,
    typesPredicate,
    typePredicate,
    articleSeriesPredicate
  ].filter(Boolean);
  const apiResponse = await getDocuments(req, predicates, {
    fetchLinks: pagesFields.concat(
      interpretationTypesFields,
      placesFields,
      eventFormatsFields,
      eventPoliciesFields,
      audiencesFields,
      articleSeriesFields
    ),
    pageSize: pageSize || 100,
    orderings: `[${(orderings || []).join(',')}]`
  });
  const multiContent = parseMultiContent(apiResponse.results);

  return {
    currentPage: apiResponse.currentPage,
    pageSize: apiResponse.pageSize,
    totalResults: apiResponse.totalResults,
    totalPages: apiResponse.totalPages,
    results: multiContent
  };
}
