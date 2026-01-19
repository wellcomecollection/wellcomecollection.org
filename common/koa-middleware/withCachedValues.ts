import Router from '@koa/router';
import { IncomingMessage, ServerResponse } from 'http';
import compose from 'koa-compose';
import { NextServer } from 'next/dist/server/next';
import { parse, UrlWithParsedQuery } from 'url';

import { withPrismicPreviewStatus } from './withPrismicPreviewStatus';

export const withCachedValues = compose([withPrismicPreviewStatus]);

export async function route(
  path: string,
  page: string,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  router: Router<any, any>,
  /* eslint-enable @typescript-eslint/no-explicit-any */
  app: NextServer,
  extraParams: Record<string, string> = {}
) {
  router.get(path, async ctx => {
    const params = ctx.params;
    const query = ctx.query;

    await app.render(ctx.req, ctx.res, page, {
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
  /* eslint-disable @typescript-eslint/no-explicit-any */
) => Promise<any>;
/* eslint-enable @typescript-eslint/no-explicit-any */

export function handleAllRoute(handle: Handle) {
  return async function (ctx, extraCtxParams = {}) {
    const parsedUrl = parse(ctx.request.url, true);
    const query = {
      ...parsedUrl.query,
      ...extraCtxParams,
    };
    const url = {
      ...parsedUrl,
      query,
    };
    await handle(ctx.req, ctx.res, url);
    ctx.respond = false;
  };
}
