// @flow
import Prismic from '@prismicio/client';
import type {
  PrismicDocument,
  PrismicQueryOpts,
  PrismicApiSearchResponse,
  PaginatedResults,
  DocumentType,
} from './types';
import Cookies from 'universal-cookie';

const apiUri = 'https://wellcomecollection.cdn.prismic.io/api/v2';

/*
 * We are seeing sporadic ECONNRESET errors from Prismic that do not appear
 * to be correlated to any particular requests or content. It seems possible
 * that this is due to us using a _lot_ of TCP connections, so this custom agent
 * keeps connections alive and allows a lot of open sockets.
 *
 * https://community.prismic.io/t/fetch-error-on-rest-api-econnreset/3632/6
 * https://github.com/prismicio/prismic-client/issues/44
 */
const keepAliveAgent =
  typeof window === 'undefined'
    ? (() => {
        // Only import the HTTP Agent on the server side
        const { Agent } = require('https');
        return new Agent({ keepAlive: true, maxSockets: 32 });
      })()
    : undefined;

export function isPreview(req: ?Request): boolean {
  // This request isn't the same as a fetch request
  // but it's a real pain to propagate the right types through
  // all of this Flow code.
  // $FlowFixMe
  const maybeCookieHeader = req && req.headers.cookie;
  const cookies = new Cookies(maybeCookieHeader);
  return (
    Boolean(cookies.get('isPreview')) ||
    Boolean(cookies.get(Prismic.previewCookie))
  );
}

export function getPrismicApi(req: ?Request) {
  return Prismic.getApi(apiUri, {
    req: isPreview(req) ? req : undefined,
    proxyAgent: keepAliveAgent,
  });
}

export async function getDocument(
  req: ?Request,
  id: string,
  opts: PrismicQueryOpts,
  memoizedPrismic: ?Object
): Promise<?PrismicDocument> {
  const prismicApi =
    memoizedPrismic && !isPreview(req)
      ? memoizedPrismic
      : await getPrismicApi(req);
  // If the ID has characters like `"` in it, Prismic returns a 400
  // rather than a 404
  const safeId = encodeURIComponent(id);
  const doc = await prismicApi.getByID(safeId, opts);
  return doc;
}

type Predicate = string;

export async function getDocuments(
  req: ?Request,
  predicates: Predicate[],
  opts: PrismicQueryOpts,
  memoizedPrismic: ?Object
): Promise<PaginatedResults<PrismicDocument>> {
  const prismicApi =
    memoizedPrismic && !isPreview(req)
      ? memoizedPrismic
      : await getPrismicApi(req);
  const docs: PrismicApiSearchResponse = await prismicApi.query(
    predicates.concat([Prismic.Predicates.not('document.tags', ['delist'])]),
    // uncomment this and comment out the line above to show delisted content
    // predicates,
    opts
  );
  const paginatedResults = {
    currentPage: docs.page,
    pageSize: docs.results_per_page,
    totalResults: docs.total_results_size,
    totalPages: docs.total_pages,
    results: docs.results,
  };

  return paginatedResults;
}

export async function getTypeByIds(
  req: ?Request,
  types: DocumentType[],
  ids: string[],
  qOpts: {}
) {
  const prismic = await getPrismicApi(req);
  const doc = await prismic.getByIDs(ids, qOpts);

  return doc;
}
