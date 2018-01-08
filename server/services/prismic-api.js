import Prismic from 'prismic-javascript';

const oneMinute = 1000 * 60;
const apiUri = 'https://wellcomecollection.prismic.io/api/v2';

let memoizedPrismic;

function periodicallyUpdatePrismic() {
  setInterval(async() => {
    memoizedPrismic = await Prismic.getApi(apiUri);
  }, oneMinute);
}

export function hasPreviewCookie(cookies) {
  const previewCookie = cookies.get(Prismic.previewCookie);
  return Boolean(previewCookie);
}

export async function getPrismic(cookies) {
  console.info(`New prismic getter being used for ${cookies.request.url}`);
  const isPreview = hasPreviewCookie(cookies);

  const api = isPreview ? await Prismic.getApi(apiUri, {req: cookies.request})
    : !memoizedPrismic ? await Prismic.getApi(apiUri)
    : memoizedPrismic;

  return api;
}

export async function prismicApi() {
  if (!memoizedPrismic) {
    memoizedPrismic = await Prismic.getApi(apiUri);
  }

  return memoizedPrismic;
}
periodicallyUpdatePrismic();

export async function prismicPreviewApi(req) {
  return await Prismic.getApi(apiUri, {req});
}
