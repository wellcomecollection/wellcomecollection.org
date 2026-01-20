import { IncomingMessage, ServerResponse } from 'http';
import { NextServer } from 'next/dist/server/next';
import { parse, UrlWithParsedQuery } from 'url';

import { withPrismicPreviewStatus } from './withPrismicPreviewStatus';

type Next = () => Promise<unknown>;

type Middleware<Context = unknown> = (
  ctx: Context,
  next: Next
) => Promise<unknown>;

type RouterContext = {
  params: Record<string, string>;
  query: Record<string, string>;
  req: IncomingMessage;
  res: ServerResponse;
  request: { url: string; host: string };
  respond: boolean;
  headers: Record<string, string | string[] | undefined>;
  cookies: {
    set(name: string, value: string, options?: { httpOnly?: boolean }): void;
  };
};

type RouterLike = {
  get(
    path: string,
    handler: (ctx: RouterContext) => Promise<void> | void
  ): void;
};

export const withCachedValues: Middleware<RouterContext> = async (ctx, next) =>
  withPrismicPreviewStatus(ctx, next);

export async function route(
  path: string,
  page: string,

  router: RouterLike,

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
