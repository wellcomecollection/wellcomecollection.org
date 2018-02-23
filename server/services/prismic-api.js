import Prismic from 'prismic-javascript';
import Cookies from 'cookies';

const oneMinute = 1000 * 60;
const apiUri = 'https://wellcomecollection.prismic.io/api/v2';

let memoizedPrismic;

function periodicallyUpdatePrismic() {
  setInterval(async() => {
    memoizedPrismic = await Prismic.getApi(apiUri);
  }, oneMinute);
}

export async function prismicApi() {
  if (!memoizedPrismic) {
    memoizedPrismic = await Prismic.getApi(apiUri);
  }

  return memoizedPrismic;
}

export function isPreview(req) {
  return Boolean(new Cookies(req).get(Prismic.previewCookie));
}

export async function getPrismicApi(req) {
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

periodicallyUpdatePrismic();

export async function prismicPreviewApi(req) {
  const api = await Prismic.getApi(apiUri, {req});

  return api;
}
