import compose from 'koa-compose';
import { withPrismicPreviewStatus } from './withPrismicPreviewStatus';
import {
  withMemoizedPrismic,
  memoizedPrismicTimer,
  MemoizedPrismicContext,
} from './withMemoizedPrismic';
import { IncomingMessage, ServerResponse } from 'http';
import Router from 'koa-router';
import { NextServer } from 'next/dist/server/next';
import { parse, UrlWithParsedQuery } from 'url'; // eslint-disable-line node/no-deprecated-api

export const withCachedValues = compose([
  withMemoizedPrismic,
  withPrismicPreviewStatus,
]);

export async function route(
  path: string,
  page: string,
  router: Router<any, MemoizedPrismicContext>,
  app: NextServer,
  extraParams: Record<string, string> = {}
) {
  router.get(path, async ctx => {
    const { memoizedPrismic } = ctx;
    const params = ctx.params;
    const query = ctx.query;

    await app.render(ctx.req, ctx.res, page, {
      memoizedPrismic,
      ...params,
      ...query,
      ...extraParams,
    });
    ctx.respond = false;
  });
}

type Handle = (
  req: IncomingMessage,
  res: ServerResponse,
  parsedUrl?: UrlWithParsedQuery | undefined
) => Promise<any>;

export function handleAllRoute(handle: Handle) {
  return async function (ctx, extraCtxParams = {}) {
    const parsedUrl = parse(ctx.request.url, true);
    const { memoizedPrismic } = ctx;
    const query = {
      ...parsedUrl.query,
      ...extraCtxParams,
      memoizedPrismic,
    };
    const url = {
      ...parsedUrl,
      query,
    };
    await handle(ctx.req, ctx.res, url);
    ctx.respond = false;
  };
}

export const timers = [memoizedPrismicTimer];
