/* eslint-disable @typescript-eslint/no-var-requires, import/first */
// This needs to be the first module loaded in the application
require('@weco/common/services/apm/initApm')('content-server');
import Koa from 'koa';
import Router from 'koa-router';
import next from 'next';
import { apmErrorMiddleware } from '@weco/common/services/apm/errorMiddleware';
import { init as initServerData } from '@weco/common/server-data';
import bodyParser from 'koa-bodyparser';
import handleNewsletterSignup from './routeHandlers/handleNewsletterSignup';
import {
  withCachedValues,
  route,
  handleAllRoute,
} from '@weco/common/koa-middleware/withCachedValues';
import { homepageId, prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { Periods } from './types/periods';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { createClient as createPrismicClient } from '@weco/common/services/prismic/fetch';
import * as prismic from '@prismicio/client';
import { vanityUrls } from '@weco/common/data/vanity-urls';

const periodPaths = Object.values(Periods).join('|');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const permanentRedirect = 301;

function pageVanityUrl(
  router: Router,
  app,
  url: string,
  pageId: string,
  template: string
) {
  // Redirect specific page IDs to their vanity URL.  In some cases, this also
  // means redirecting them to a different template (e.g. the homepage needs
  // to go to the homepage template, not the page template with ID=Xph...)
  //
  // Note: we have similar logic in a Lambda@Edge that's part of the CloudFront
  // distribution, but we duplicate it here because this is the most up-to-date
  // definition of vanity URLs.
  //
  // See https://github.com/wellcomecollection/wellcomecollection.org/blob/main/cache/edge_lambdas/src/redirects.ts
  const regularPage =
    template === '/page'
      ? `/pages/${pageId}`
      : template === '/exhibition'
      ? `/exhibitions/${pageId}`
      : null;

  if (regularPage !== null) {
    router.redirect(regularPage, url, permanentRedirect);
  }

  route(url, template, router, app, { pageId });
}

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

    koaApp.use(apmErrorMiddleware);
    koaApp.use(withCachedValues);
    koaApp.use(bodyParser());

    pageVanityUrl(router, nextApp, '/', homepageId, '/homepage');

    route(`/whats-on/:period(${periodPaths})`, '/whats-on', router, nextApp);

    // We define the vanity URLs as soon as possible, so they can intercept
    // any routes defined further down, e.g. /pages/:id
    vanityUrls.forEach(({ url, prismicId }) =>
      pageVanityUrl(router, nextApp, url, prismicId, `/pages/${prismicId}`)
    );

    route(
      `/exhibitions/:period(${periodPaths})`,
      '/exhibitions',
      router,
      nextApp
    );

    route(`/events/:period(${periodPaths})`, '/events', router, nextApp);

    router.redirect(
      `/pages/${prismicPageIds.collections}`,
      '/collections',
      permanentRedirect
    );

    router.redirect(
      `/pages/${prismicPageIds.visitUs}`,
      '/visit-us',
      permanentRedirect
    );

    router.post('/newsletter-signup', handleNewsletterSignup);

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

    router.get('/content/management/healthcheck', async ctx => {
      ctx.status = 200;
      ctx.body = 'ok';
    });
    router.get('*', handleAllRoute(handle));

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