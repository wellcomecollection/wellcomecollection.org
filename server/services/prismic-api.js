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

let memoizedPrismicV2;
export async function prismicApiV2() {
  if (!memoizedPrismicV2) {
    memoizedPrismicV2 = await PrismicV2.api('https://wellcomecollection.prismic.io/api/v2');
  }

  return memoizedPrismicV2;
}
