import Prismic from 'prismic-javascript';

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
periodicallyUpdatePrismic();

export async function prismicPreviewApi(req) {
  return await Prismic.getApi(apiUri, {req});
}
