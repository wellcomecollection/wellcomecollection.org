import Prismic from 'prismic.io';
import PrismicV2 from 'prismic-javascript';

// This is so only the first request to the app once started has to make this request.
let memoizedPrismic;
export async function prismicApi() {
  if (!memoizedPrismic) {
    memoizedPrismic = await Prismic.api('https://wellcomecollection.prismic.io/api');
  }

  return memoizedPrismic;
}

// TODO: Setup interval to update this every now and then.
const apiV2Uri = 'https://wellcomecollection.prismic.io/api/v2';
let memoizedPrismicV2;
export async function prismicApiV2() {
  if (!memoizedPrismicV2) {
    memoizedPrismicV2 = await PrismicV2.getApi(apiV2Uri);
  }

  return memoizedPrismicV2;
}

export async function prismicPreviewApi(req) {
  return await PrismicV2.getApi(apiV2Uri, {req});
}
