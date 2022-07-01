/* eslint-disable @typescript-eslint/no-var-requires, import/first */
// This needs to be the first module loaded in the application

require('@weco/common/services/apm/initApm')('identity-server');

import Koa from 'koa';
import json from 'koa-json';
import logger from 'koa-logger';
import Router from '@koa/router';
import next from 'next';
import { apmErrorMiddleware } from '@weco/common/services/apm/errorMiddleware';
import { init as initServerData } from '@weco/common/server-data';
import { format as formatUrl, parse } from 'url'; // eslint-disable-line node/no-deprecated-api

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

  // This custom logger query parameter values from the logs.
  //
  // This is to prevent PII from being written to the logs, in particular
  // email addresses and other personal information being passed around
  // as JWTs as part of the sign-up process.
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

        // Note: we use a deprecated API here because we're working with
        // relative URLs, e.g. `/account`.
        //
        // The WHATWG URL API that the deprecation message suggests doesn't
        // work for this use case; it wants absolute URLs.
        const parsedUrl = parse(url);
        const params = new URLSearchParams(parsedUrl.query);

        for (const key of params.keys()) {
          params.set(key, '[redacted]');
        }

        parsedUrl.query = params.toString();
        parsedUrl.search = `?${params.toString()}`;

        // When the square brackets get URL-encoded, they're replaced with
        // percent characters, e.g. `/account?token=%5Bredacted%5D`.
        //
        // Because they aren't actually URL characters, we put back the
        // original brackets for ease of readability.
        const redactedUrl = formatUrl(parsedUrl).replace(
          '%5Bredacted%5D',
          '[redacted]'
        );

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
  router.all('(.*)', async ctx => {
    await nextHandler(ctx.req, ctx.res);
    ctx.respond = false;
  });

  app.use(router.routes()).use(router.allowedMethods());

  process.on('SIGINT', async () => {
    // Close any connections and clean up.
    process.exit(0);
  });

  return app;
}
