/* eslint-disable @typescript-eslint/no-var-requires, import/first */
// This needs to be the first module loaded in the application
require('@weco/common/services/apm/initApm')('catalogue-server');

import Koa from 'koa';
import Router from 'koa-router';
import next from 'next';

import {
  withCachedValues,
  handleAllRoute,
} from '@weco/common/koa-middleware/withCachedValues';
import { apmErrorMiddleware } from '@weco/common/services/apm/errorMiddleware';
import { init as initServerData } from '@weco/common/server-data';

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const appPromise = nextApp.prepare().then(async () => {
  await initServerData();

  const koaApp = new Koa();
  const router = new Router();

  koaApp.use(apmErrorMiddleware);
  koaApp.use(withCachedValues);

  router.get('*', handleAllRoute(handle));

  koaApp.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    await next();
  });

  koaApp.use(router.routes());
  return koaApp;
});

export default appPromise;
