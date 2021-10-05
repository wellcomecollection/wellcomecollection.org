// @flow
import Prismic from '@prismicio/client';
import { getDocuments } from './api';
import { parsePage } from './pages';
import { Page } from '../../model/pages';
import { PaginatedResults } from './types';
import { IncomingMessage } from 'http';
import { pagesFormatsFields } from './fetch-links';

type GetProjectsProps = {
  predicates?: string[];
  page?: number;
};

const fetchLinks = [pagesFormatsFields];

export async function getProjects(
  req: IncomingMessage | undefined,
  { predicates = [], page = 1 }: GetProjectsProps = {},
  memoizedPrismic: Record<string, unknown>
): Promise<PaginatedResults<Page>> {
  const paginatedResults = await getDocuments(
    req,
    [Prismic.Predicates.any('document.type', ['projects'])].concat(predicates),
    {
      fetchLinks,
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
