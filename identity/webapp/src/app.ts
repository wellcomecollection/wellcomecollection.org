/* eslint-disable @typescript-eslint/no-var-requires, import/first */
// This needs to be the first module loaded in the application

require('@weco/common/services/apm/initApm')('identity-server');

import Router from '@koa/router';
import Koa from 'koa';
import json from 'koa-json';
import logger from 'koa-logger';
import next from 'next';

import { init as initServerData } from '@weco/common/server-data';
import { apmErrorMiddleware } from '@weco/common/services/apm/errorMiddleware';
import { redactUrl } from '@weco/identity/utils/logging';

/* eslint-enable @typescript-eslint/no-var-requires, import/first */

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

  app.use(json({ pretty: process.env.NODE_ENV !== 'production' }));

  // This custom logger redacts URLs in the logs.
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
  //    * Documentation for custom transporters
  //      https://github.com/koajs/logger#use-custom-transporter
  //    * Slack discussion about access tokens in logs
  //      https://wellcome.slack.com/archives/CUA669WHH/p1656593455081159
  //
  app.use(
    logger({
      transporter: (_, args) => {
        const [format, method, url, status, time, length] = args;

        const redactedUrl = redactUrl(url);

        const newArgs = [
          format,
          method,
          redactedUrl,
          status,
          time,
          length,
        ].filter(Boolean);

        console.log(...newArgs);
      },
    })
  );

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
