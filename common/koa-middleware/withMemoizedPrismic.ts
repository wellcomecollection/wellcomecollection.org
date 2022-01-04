import Raven from 'raven-js';
import Prismic from '@prismicio/client';
import { Middleware } from 'koa-compose';
import Koa from 'koa';

export type MemoizedPrismicContext = {
  // Note: we know this will be a Record<string, any>, but I get type errors
  // if I try to pass a more specific type to app.render() in withCachedValues.
  memoizedPrismic?: any;
};

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

export const memoizedPrismicTimer = setInterval(getMemoizedPrismic, oneMinute);

async function withPrismicAPI(ctx: MemoizedPrismicContext, next: Koa.Next) {
  if (!memoizedPrismic) {
    await getMemoizedPrismic();
  }
  ctx.memoizedPrismic = memoizedPrismic;
  return next();
}

export const withMemoizedPrismic: Middleware<MemoizedPrismicContext> =
  withPrismicAPI;
