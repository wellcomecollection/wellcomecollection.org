const Raven = require('raven-js');
const Prismic = require('prismic-javascript');
const oneMinute = 1000 * 60;
const apiUri = 'https://wellcomecollection.prismic.io/api/v2';

let memoizedPrismic;
async function getMemoizedPrismic() {
  try {
    memoizedPrismic = await Prismic.getApi(apiUri);
  } catch (error) {
    Raven.captureException(new Error(`Prismic error: ${error}`));
  }
}

setInterval(getMemoizedPrismic, oneMinute);
module.exports = function withPrismicAPI(ctx, next) {
  ctx.memoizedPrismic = memoizedPrismic;
  return next();
};
