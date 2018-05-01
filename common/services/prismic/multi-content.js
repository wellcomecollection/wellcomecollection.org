// @flow
// This service is used for getting content of multiple types of content.
import Prismic from 'prismic-javascript';
import {getDocuments} from './api';
import { parseInfoPage } from './info-pages';
import { infoPagesFields } from './fetch-links';
import type {MultiContent} from '../../model/multi-content';
import type {PaginatedResults} from './types';

type ContentQuery = {
  ids?: string[],
  tags?: string[]
};

function parseMultiContent(documents): MultiContent[] {
  return documents.map(document => {
    if (document.type === 'info-pages') {
      return parseInfoPage(document);
    }
  }).filter(Boolean);
}

export async function getMultiContent(
  req: Request,
  { ids = [], tags = [] }: ContentQuery
): Promise<PaginatedResults<MultiContent>> {
  // TODO the document.tags predicate should probably be an `in` rather than `at`
  const idsPredicate = ids.length > 0 ? [Prismic.Predicates.in('document.id', ids)] : [];
  const tagsPredicate = tags.length > 0 ? [Prismic.Predicates.at('document.tags', tags)] : [];
  const predicates = idsPredicate.concat(tagsPredicate);
  const apiResponse = await getDocuments(req, predicates, {
    fetchLinks: infoPagesFields,
    pageSize: 100
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
