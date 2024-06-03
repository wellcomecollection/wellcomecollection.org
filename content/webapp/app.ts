/* eslint-disable @typescript-eslint/no-var-requires, import/first */
// This needs to be the first module loaded in the application
require('@weco/common/services/apm/initApm')('content-server');
import Koa from 'koa';
import Router from 'koa-router';
import next from 'next';
import { apmErrorMiddleware } from '@weco/common/services/apm/errorMiddleware';
import { init as initServerData } from '@weco/common/server-data';
import {
  withCachedValues,
  handleAllRoute,
} from '@weco/common/koa-middleware/withCachedValues';
import { prismicEnv } from '@weco/common/koa-middleware/prismicEnv';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { createClient as createPrismicClient } from '@weco/common/services/prismic/fetch';
import * as prismic from '@prismicio/client';

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const appPromise = nextApp
  .prepare()
  .then(async () => {
    await initServerData();

    const koaApp = new Koa();
    const router = new Router({
      // We have to enable case-sensitive routing to deal with a bizarre
      // choice of identifier from Prismic.  We have two pages with almost
      // identical IDs:
      //
      //    Schools
      //    https://wellcomecollection.prismic.io/documents~b=working&c=published&l=en-gb/Wuw2MSIAACtd3StS/
      //
      //    RawMinds
      //    https://wellcomecollection.prismic.io/documents~b=working&c=published&l=en-gb/Wuw2MSIAACtd3Sts/
      //
      // They differ only in that final 's/S', and for added complication we
      // redirect the /pages/<school ID> because it's a vanity URL.
      //
      // With case-insensitive routing, we were redirecting /pages/<RawMinds ID>
      // to /schools, which is wrong.
      sensitive: true,
    });

    koaApp.use(prismicEnv);
    koaApp.use(apmErrorMiddleware);
    koaApp.use(withCachedValues);

    // Add a naive healthcheck endpoint for the load balancer
    router.get('/management/healthcheck', async ctx => {
      ctx.body = {
        status: 'ok',
      };
    });

    router.get('/preview', async ctx => {
      // Kill any cookie we had set, as it think it is causing issues.
      ctx.cookies.set(prismic.cookie.preview);

      const client = createPrismicClient();
      client.enableAutoPreviewsFromReq(ctx.request);

      /**
       * This is because the type in api.resolve are not true
       */
      const retypedLinkResolver = doc => {
        return (linkResolver(doc) as string) || '/';
      };

      const url = await client.resolvePreviewURL({
        linkResolver: retypedLinkResolver,
        defaultURL: '/',
      });

      ctx.cookies.set('isPreview', 'true', {
        httpOnly: false,
      });

      ctx.redirect(url);
    });

    router.all('*', handleAllRoute(handle));

    koaApp.use(async (ctx, next) => {
      ctx.res.statusCode = 200;
      await next();
    });

    koaApp.use(router.routes());

    return koaApp;
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });

export default appPromise;
