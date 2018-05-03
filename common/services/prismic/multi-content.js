// @flow
// This service is used for getting content of multiple types of content.
import Prismic from 'prismic-javascript';
import {getDocuments} from './api';
import { parseInfoPage } from './info-pages';
import { infoPagesFields } from './fetch-links';
import type {MultiContent} from '../../model/multi-content';
import type {StructuredSearchQuery} from './search';
import type {PaginatedResults} from './types';

function parseMultiContent(documents): MultiContent[] {
  return documents.map(document => {
    if (document.type === 'info-pages') {
      return parseInfoPage(document);
    }
  }).filter(Boolean);
}

export async function getMultiContent(
  req: Request,
  structuredSearchQuery: StructuredSearchQuery
): Promise<PaginatedResults<MultiContent>> {
  const {types, type, id, ids, tags, tag, pageSize} = structuredSearchQuery;
  const idsPredicate = ids.length > 0 ? Prismic.Predicates.at('document.id', ids) : null;
  const idPredicate = id.length > 0 ? Prismic.Predicates.in('document.id', id) : null;
  const tagsPredicate = tags.length > 0 ? Prismic.Predicates.at('document.tags', tags) : null;
  const tagPredicate = tag.length > 0 ? Prismic.Predicates.any('document.tags', tag) : null;
  const typesPredicate = types.length > 0 ? Prismic.Predicates.in('document.type', types) : null;
  const typePredicate = type.length > 0 ? Prismic.Predicates.any('document.type', type) : null;

  const predicates = [
    idsPredicate,
    idPredicate,
    tagsPredicate,
    tagPredicate,
    typesPredicate,
    typePredicate
  ].filter(Boolean);

  const apiResponse = await getDocuments(req, predicates, {
    fetchLinks: infoPagesFields,
    pageSize: pageSize || 100
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
