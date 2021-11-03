/* eslint-disable @typescript-eslint/no-var-requires, import/first */
// This needs to be the first module loaded in the application

require('@weco/common/services/apm/initApm')('identity-server');

import Koa from 'koa';
import json from 'koa-json';
import session from 'koa-session';
import logger from 'koa-logger';
import koaPassport from 'koa-passport';
import Router from '@koa/router';
import Ajv from 'ajv';
import * as path from 'path';
import next from 'next';
import { readdirSync, readFileSync } from 'fs';
import { errorHandler } from './middleware/error-handler';
import { configureLocalAuth } from './utility/configure-local-auth';
import { config } from './config';
import { configureAuth0 } from './utility/configure-auth0';
import apmErrorMiddleware from '@weco/common/services/apm/errorMiddleware';
import { ApplicationContext, ApplicationState } from './types/application';
/* eslint-enable @typescript-eslint/no-var-requires, import/first */

export async function createApp(
  router: Router<ApplicationState, ApplicationContext>
): Promise<Koa> {
  const isProduction = process.env.NODE_ENV === 'production';

  const nextApp = next({
    dev: !isProduction,
  });
  const nextHandler = nextApp.getRequestHandler();
  await nextApp.prepare();

  const app = new Koa();
  app.proxy = isProduction;
  app.use(apmErrorMiddleware);

  // Session.
  app.keys = config.sessionKeys;
  app.use(session(config.session, app));

  if (config.authMethod === 'auth0') {
    configureAuth0();
  } else if (config.authMethod === 'local') {
    configureLocalAuth();
  }

  app.use(koaPassport.initialize());
  app.use(koaPassport.session());

  // Validator.
  app.context.ajv = new Ajv();
  for (const file of readdirSync(path.resolve(__dirname, '..', 'schemas'))) {
    if (file.endsWith('.json')) {
      const name = path.basename(file, '.json');
      app.context.ajv.addSchema(
        JSON.parse(
          readFileSync(path.resolve(__dirname, '..', 'schemas', file)).toString(
            'utf-8'
          )
        ),
        name
      );
    }
  }

  app.use(json({ pretty: process.env.NODE_ENV !== 'production' }));
  app.use(logger());
  app.use(errorHandler);

  const isAuthenticated = (ctx, next) => {
    if (ctx.isAuthenticated()) {
      return next();
    }

    ctx.redirect('/account/login');
  };

  // Next specific routes
  router.get('/account', isAuthenticated, async ctx => {
    await nextHandler(ctx.req, ctx.res);
    ctx.respond = false;
  });

  // Next catch-all route
  router.get('(.*)', async ctx => {
    await nextHandler(ctx.req, ctx.res);
    ctx.respond = false;
  });

  // API routes
  app.use(router.routes()).use(router.allowedMethods());

  process.on('SIGINT', async () => {
    // Close any connections and clean up.
    process.exit(0);
  });

  return app;
}
