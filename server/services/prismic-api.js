import Prismic from 'prismic.io';

// This is so only the first request to the app once started has to make this request.
let memoizedPrismic;
export async function prismicApi() {
  if (!memoizedPrismic) {
    memoizedPrismic = await Prismic.api('http://wellcomecollection.prismic.io/api');
  }

  return memoizedPrismic;
}
