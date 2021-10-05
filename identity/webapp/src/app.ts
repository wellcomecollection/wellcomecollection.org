/* eslint-disable @typescript-eslint/no-var-requires, import/first */
// This needs to be the first module loaded in the application
require('@weco/common/services/apm/initApm')('identity-server');

import Koa from 'koa';
import json from 'koa-json';
import session from 'koa-session';
import logger from 'koa-logger';
import koaPassport from 'koa-passport';
import Ajv from 'ajv';
import * as path from 'path';
import next from 'next';
import { readdirSync, readFileSync } from 'fs';
import { errorHandler } from './middleware/error-handler';
import { TypedRouter } from './utility/typed-router';
import { configureLocalAuth } from './utility/configure-local-auth';
import { config } from './config';
import { configureAuth0 } from './utility/configure-auth0';
import apmErrorMiddleware from '@weco/common/services/apm/errorMiddleware';
/* eslint-enable @typescript-eslint/no-var-requires, import/first */

export async function createApp(
  router: TypedRouter<never, never>
): Promise<Koa> {
  const nextApp = next({
    dev: process.env.NODE_ENV !== 'production',
  });
  const nextHandler = nextApp.getRequestHandler();
  await nextApp.prepare();

  const app = new Koa();
  app.use(apmErrorMiddleware);

  app.context.routes = router;

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

  const koaRouter = router.router;
  const isAuthenticated = (ctx, next) => {
    if (ctx.isAuthenticated()) {
      return next();
    }

    ctx.redirect('/account/login');
  };

  // API routes
  app.use(koaRouter.routes()).use(koaRouter.allowedMethods());

  // Next specific routes
  koaRouter.get('/account', isAuthenticated, async ctx => {
    await nextHandler(ctx.req, ctx.res);
    ctx.respond = false;
  });

  // Next catch-all route
  koaRouter.get('(.*)', async ctx => {
    await nextHandler(ctx.req, ctx.res);
    ctx.respond = false;
  });

  process.on('SIGINT', async () => {
    // Close any connections and clean up.
    process.exit(0);
  });

  return app;
}
