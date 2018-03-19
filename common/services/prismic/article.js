// @flow
/* eslint-disable */
import {getDocument, getDocumentsOfTypes} from './api';

type Article = any;
export type PaginatedResults<T> = {|
  currentPage: number;
  results: Array<T>;
  pageSize: number;
  totalResults: number;
  totalPages: number;
  pagination: Pagination;
|};

async function getArticle(req: Request, id: string): Promise<?Article> {
  const document = await getDocument(req, id, {});
  return document.type === 'article' ? document : null;
}
