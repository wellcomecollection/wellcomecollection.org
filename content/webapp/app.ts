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
import {
  homepageId,
  prismicPageIds,
} from '@weco/common/services/prismic/hardcoded-id';
import { Periods } from './types/periods';
import linkResolver from './services/prismic/link-resolver';
import * as prismic from '@prismicio/client';

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
  template = '/page'
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
  router.redirect(`/pages/${pageId}`, url, permanentRedirect);

  route(url, template, router, app, { id: pageId });
}

// A Prismic ID is an alphanumeric string, plus underscore and hyphen
//
// We filter out any requests for pages that obviously aren't Prismic IDs; we know
// they're not going to work, and they may be attempts to inject malicious data into
// our Prismic queries.
const prismicId = '[a-zA-Z0-9-_]+';

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
    route('/whats-on', '/whats-on', router, nextApp);
    route(`/whats-on/:period(${periodPaths})`, '/whats-on', router, nextApp);

    route('/exhibitions', '/exhibitions', router, nextApp);
    route(
      `/exhibitions/:period(${periodPaths})`,
      '/exhibitions',
      router,
      nextApp
    );
    route('/exhibitions/:id', '/exhibition', router, nextApp);

    route('/events', '/events', router, nextApp);
    route(`/events/:period(${periodPaths})`, '/events', router, nextApp);
    route(`/events/:id(${prismicId})`, '/event', router, nextApp);
    route(`/event-series/:id(${prismicId})`, '/event-series', router, nextApp);

    route('/articles', '/articles', router, nextApp);
    route(`/articles/:id(${prismicId})`, '/article', router, nextApp);
    route(`/series/:id(${prismicId})`, '/article-series', router, nextApp);
    route(`/projects/:id(${prismicId})`, '/page', router, nextApp);

    route('/books', '/books', router, nextApp);
    route(`/books/:id(${prismicId})`, '/book', router, nextApp);

    route(`/places/:id(${prismicId})`, '/place', router, nextApp);
    route(`/seasons/:id(${prismicId})`, '/season', router, nextApp);

    route('/newsletter', '/newsletter', router, nextApp);

    route('/guides', '/guides', router, nextApp);
    route('/guides/exhibitions', '/exhibition-guides', router, nextApp);
    route(
      `/guides/exhibitions/:id(${prismicId})/:type?`,
      '/exhibition-guide',
      router,
      nextApp
    ); // :type(${guideType})
    route(`/guides/:id(${prismicId})`, '/page', router, nextApp);

    pageVanityUrl(
      router,
      nextApp,
      '/opening-times',
      prismicPageIds.openingTimes
    );
    pageVanityUrl(router, nextApp, '/what-we-do', prismicPageIds.whatWeDo);
    pageVanityUrl(router, nextApp, '/press', prismicPageIds.press);
    pageVanityUrl(router, nextApp, '/venue-hire', prismicPageIds.venueHire);
    pageVanityUrl(router, nextApp, '/access', prismicPageIds.access);
    pageVanityUrl(router, nextApp, '/youth', prismicPageIds.youth);
    pageVanityUrl(router, nextApp, '/schools', prismicPageIds.schools);
    pageVanityUrl(
      router,
      nextApp,
      '/covid-welcome-back',
      prismicPageIds.covidWelcomeBack
    );
    pageVanityUrl(router, nextApp, '/about-us', prismicPageIds.aboutUs);
    pageVanityUrl(router, nextApp, '/get-involved', prismicPageIds.getInvolved);
    pageVanityUrl(router, nextApp, '/user-panel', prismicPageIds.userPanel);

    router.redirect(
      `/pages/${prismicPageIds.stories}`,
      '/stories',
      permanentRedirect
    );
    route('/stories', '/stories', router, nextApp);

    router.redirect(
      `/pages/${prismicPageIds.collections}`,
      '/collections',
      permanentRedirect
    );
    route('/collections', '/collections', router, nextApp);

    router.redirect(
      `/pages/${prismicPageIds.visitUs}`,
      '/visit-us',
      permanentRedirect
    );
    route('/visit-us', '/visit-us', router, nextApp);

    // We define this _after_ the vanity URLs and redirects for specific page IDs;
    // this means this route will only serve pages that we want to be accessible by
    // ID and not a vanity URL.
    route(`/pages/:id(${prismicId})`, '/page', router, nextApp);

    router.post('/newsletter-signup', handleNewsletterSignup);

    router.get('/preview', async ctx => {
      // Kill any cookie we had set, as it think it is causing issues.
      ctx.cookies.set(prismic.cookie.preview);

      const endpoint = prismic.getEndpoint('wellcomecollection');
      const client = prismic.createClient(endpoint, { fetch });
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

    router.get('/oembed', async ctx => {
      const iframeUrl = ctx.query.url;
      const width = ctx.query.width || '320';
      const height = ctx.query.height || '300';

      const oembedResponseObject = {
        type: 'rich',
        version: '1.0',
        width,
        height,
        html: `<iframe style='width: 100%; overflow: hidden;' src='${iframeUrl}' width='${width}' height='${height}' frameborder='0' scrolling='no'></iframe>`,
      };
      ctx.res.setHeader('Content-Type', 'application/json');
      ctx.body = JSON.stringify(oembedResponseObject);
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
