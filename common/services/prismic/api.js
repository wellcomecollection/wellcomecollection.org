// @flow
import Prismic from 'prismic-javascript';
import Cookies from 'cookies';
import type {Document as PrismicDocument, PrismicQueryOpts} from './types';

const oneMinute = 1000 * 60;
const apiUri = 'https://wellcomecollection.prismic.io/api/v2';

let memoizedPrismic;

function periodicallyUpdatePrismic() {
  setInterval(async() => {
    memoizedPrismic = await Prismic.getApi(apiUri);
  }, oneMinute);
}
periodicallyUpdatePrismic();

export function isPreview(req: Request) {
  return Boolean(new Cookies(req).get(Prismic.previewCookie));
}

export async function getPrismicApi(req: Request) {
  if (isPreview(req)) {
    const api = await Prismic.getApi(apiUri, {req});
    return api;
  } else {
    if (!memoizedPrismic) {
      memoizedPrismic = await Prismic.getApi(apiUri);
    }
    return memoizedPrismic;
  }
}

export async function getDocument(
  req: Request,
  id: string,
  opts: PrismicQueryOpts
): Promise<?PrismicDocument> {
  const api = await getPrismicApi(req);
  const doc = api.getById(id, opts);
  return doc;
}
