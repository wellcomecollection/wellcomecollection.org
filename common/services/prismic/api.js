// @flow
import Prismic from 'prismic-javascript';
// import Raven from 'raven-js';
import type {
  PrismicDocument,
  PrismicQueryOpts,
  PrismicApiSearchResponse,
  PaginatedResults,
  DocumentType,
} from './types';
import Cookies from 'cookies';

// import util from 'util';

const apiUri = 'https://wellcomecollection.prismic.io/api/v2';

export function isPreview(req: ?Request): boolean {
  const cookies = req && new Cookies(req);
  return cookies
    ? Boolean(cookies.get('isPreview')) ||
        Boolean(cookies.get(Prismic.previewCookie))
    : false;
}

export async function getPrismicApi(req: ?Request, memoizedPrismic: any) {
  // TODO flow
  if (req && isPreview(req)) {
    const api = await Prismic.getApi(apiUri, { req });
    return api;
  } else {
    if (!memoizedPrismic) {
      console.log('NOT memoized');
      const prismicApi = await Prismic.getApi(apiUri);
      return prismicApi;
    } else {
      console.log('IS memoized');
      return memoizedPrismic;
    }
  }
}

export async function getDocument(
  req: ?Request,
  id: string,
  opts: PrismicQueryOpts,
  prismicApi: any
): Promise<?PrismicDocument> {
  const doc = await prismicApi.getByID(id, opts);
  // console.log('DOC: ', util.inspect(doc, { showHidden: false, depth: null }));
  return doc;
}

type Predicate = string;

export async function getDocuments(
  req: ?Request,
  predicates: Predicate[],
  opts: PrismicQueryOpts
): Promise<PaginatedResults<PrismicDocument>> {
  const api = await getPrismicApi(req);
  const docs: PrismicApiSearchResponse = await api.query(
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
