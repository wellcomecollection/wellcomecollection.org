// @flow
import Prismic from 'prismic-javascript';
import { getDocuments } from './api';
import { parsePage } from './pages';
import { Page } from '../../model/pages';
import { PaginatedResults } from './types';
import { IncomingMessage } from 'http';

type GetProjectsProps = {
  predicates?: string[];
  page?: number;
};

export async function getProjects(
  req: IncomingMessage | undefined,
  { predicates = [], page = 1 }: GetProjectsProps = {},
  memoizedPrismic: Record<string, unknown>
): Promise<PaginatedResults<Page>> {
  const paginatedResults = await getDocuments(
    req,
    [Prismic.Predicates.any('document.type', ['projects'])].concat(predicates),
    {
      page,
    },
    memoizedPrismic
  );
  const pages: Page[] = paginatedResults.results.map(parsePage);

  return {
    currentPage: paginatedResults.currentPage,
    pageSize: paginatedResults.pageSize,
    totalResults: paginatedResults.totalResults,
    totalPages: paginatedResults.totalPages,
    results: pages,
  };
}
