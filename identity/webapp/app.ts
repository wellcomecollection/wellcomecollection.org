// This needs to be the first module loaded in the application
/* eslint-disable @typescript-eslint/no-require-imports */
require('@weco/common/services/apm/initApm')('identity-server');

import Router from '@koa/router';
import Koa from 'koa';
import next from 'next';

import { init as initServerData } from '@weco/common/server-data';
import { apmErrorMiddleware } from '@weco/common/services/apm/errorMiddleware';
import { redactUrl } from '@weco/identity/utils/logging';

export async function createApp(): Promise<Koa> {
  const isProduction = process.env.NODE_ENV === 'production';
  await initServerData();

  const nextApp = next({
    dev: !isProduction,
  });
  const nextHandler = nextApp.getRequestHandler();
  await nextApp.prepare();

  const app = new Koa();
  app.proxy = isProduction;
  app.use(apmErrorMiddleware);

  // Custom request logger that redacts URLs in the logs.
  //
  // This is to prevent PII from being written to the logs, in particular
  // email addresses and other personal information being passed around
  // as part of the sign-up process.
  //
  // The default logger might log something like:
  //
  //      --> GET /account/registration?session_token=eyJhbGciOi...{some sort of jwt}
  //
  // where the JWT could be decoded to reveal personal information including
  // email address and IP address.
  //
  // This logger will replace this with:
  //
  //      --> GET /account/registration?session_token=[redacted]
  //
  // It is deliberately un-picky about what it redacts, because we'd rather
  // remove something innocent (e.g. ?refresh=true) than miss something sensitive.
  //
  // The goal is to keep PII about library users out of the logging cluster.
  //
  // See:
  //
  //    * Slack discussion about access tokens in logs
  //      https://wellcome.slack.com/archives/CUA669WHH/p1656593455081159
  //
  function formatBytes(bytes: number | undefined): string {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes}b`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)}kb`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)}mb`;
  }

  app.use(async (ctx, next) => {
    const start = Date.now();
    const { method } = ctx;
    const url = redactUrl(ctx.url);

    console.log(`<-- ${method} ${url}`);

    await next();

    const ms = Date.now() - start;
    const { status } = ctx;
    const length = formatBytes(ctx.length);

    console.log(`--> ${method} ${url} ${status} ${ms}ms ${length}`);
  });

  const router = new Router();

  // Add a naive healthcheck endpoint for the load balancer
  router.get('/management/healthcheck', async ctx => {
    ctx.body = {
      status: 'ok',
    };
  });

  router.all('(.*)', async ctx => {
    await nextHandler(ctx.req, ctx.res);
    ctx.respond = false;
  });

  // Upgrading next passed 13.5.1 led to an issue with the incorrect status code being returned
  // So we do it explicitly here
  // See https://github.com/vercel/next.js/issues/65691 for similar
  app.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    await next();
  });

  app.use(router.routes()).use(router.allowedMethods());

  process.on('SIGINT', async () => {
    // Close any connections and clean up.
    process.exit(0);
  });

  return app;
}
