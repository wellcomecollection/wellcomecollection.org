const Raven = require('raven-js');
const Prismic = require('@prismicio/client');
const oneMinute = 1000 * 60;
const apiUri = 'https://wellcomecollection.cdn.prismic.io/api/v2';

let memoizedPrismic;
async function getMemoizedPrismic() {
  try {
    memoizedPrismic = await Prismic.getApi(apiUri);
  } catch (error) {
    Raven.captureException(new Error(`Prismic error: ${error}`));
  }
}

const interval = setInterval(getMemoizedPrismic, oneMinute);
async function withPrismicAPI(ctx, next) {
  if (!memoizedPrismic) {
    await getMemoizedPrismic();
  }
  ctx.memoizedPrismic = memoizedPrismic;
  return next();
}

const withMemoizedPrismicModule = (module.exports = withPrismicAPI);
withMemoizedPrismicModule.interval = interval;
