import Prismic from 'prismic-javascript';
import { getDocuments } from './api';
import { parsePage } from '@weco/common/services/prismic/pages';
import { pagesFormatsFields } from './fetch-links';
import { PrismicQueryOpts, PaginatedResults } from './types';
import { Page } from '../../model/pages';
import { IncomingMessage } from 'http';
import { parseFormat } from './formats';
import { Format } from '@weco/common/model/format';

type GuidesQueryProps = {
  predicates?: string[];
  format: string | string[] | undefined;
} & PrismicQueryOpts;
export async function getGuides(
  req: IncomingMessage | undefined,
  { predicates = [], format, ...opts }: GuidesQueryProps,
  memoizedPrismic: Record<string, unknown>
): Promise<PaginatedResults<Page>> {
  const filterPredicates = format
    ? [Prismic.Predicates.at('my.guides.format', format)]
    : [];

  const paginatedResults = await getDocuments(
    req,
    [Prismic.Predicates.at('document.type', 'guides')]
      .concat(predicates, filterPredicates)
      .filter(Boolean),
    {
      page: opts.page,
      pageSize: opts.pageSize,
      fetchLinks: pagesFormatsFields,
    },
    memoizedPrismic
  );

  const guides = paginatedResults.results.map(doc => {
    return parsePage(doc, null);
  });

  return {
    currentPage: paginatedResults.currentPage,
    pageSize: paginatedResults.pageSize,
    totalResults: paginatedResults.totalResults,
    totalPages: paginatedResults.totalPages,
    results: guides,
  };
}

export async function getGuideFormats(
  req: IncomingMessage | undefined,
  memoizedPrismic: Record<string, unknown>
): Promise<Format[]> {
  const guideFormats = await getDocuments(
    req,
    [Prismic.Predicates.at('document.type', 'guide-formats')],
    null,
    memoizedPrismic
  );
  const parsedFormats = guideFormats.results.map(doc => {
    return parseFormat(doc);
  });

  return parsedFormats;
}
