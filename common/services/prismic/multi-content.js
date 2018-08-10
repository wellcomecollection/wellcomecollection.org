// @flow
// This service is used for getting content of multiple types of content.
import Prismic from 'prismic-javascript';
import {getDocuments} from './api';
import { parsePage } from './pages';
import { parseEventSeries } from './event-series';
import { parseBook } from './books';
import { parseEventDoc } from './events';
import { pagesFields } from './fetch-links';
import type {MultiContent} from '../../model/multi-content';
import type {StructuredSearchQuery} from './search';
import type {PaginatedResults} from './types';

function parseMultiContent(documents): MultiContent[] {
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
    }
  }).filter(Boolean);
}

export async function getMultiContent(
  req: Request,
  structuredSearchQuery: StructuredSearchQuery
): Promise<PaginatedResults<MultiContent>> {
  const {types, type, id, ids, tags, tag, partOf, pageSize, orderings} = structuredSearchQuery;
  const idsPredicate = ids.length > 0 ? Prismic.Predicates.at('document.id', ids) : null;
  const idPredicate = id.length > 0 ? Prismic.Predicates.in('document.id', id) : null;
  const tagsPredicate = tags.length > 0 ? Prismic.Predicates.at('document.tags', tags) : null;
  const tagPredicate = tag.length > 0 ? Prismic.Predicates.any('document.tags', tag) : null;
  const partOfPredicate = partOf.length > 0 ? Prismic.Predicates.any('my.pages.tags.tag', partOf) : null;
  const typesPredicate = types.length > 0 ? Prismic.Predicates.in('document.type', types) : null;
  const typePredicate = type.length > 0 ? Prismic.Predicates.any('document.type', type) : null;
  const predicates = [
    idsPredicate,
    idPredicate,
    tagsPredicate,
    tagPredicate,
    partOfPredicate,
    typesPredicate,
    typePredicate
  ].filter(Boolean);
  const apiResponse = await getDocuments(req, predicates, {
    fetchLinks: pagesFields,
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
