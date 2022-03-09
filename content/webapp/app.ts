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

function pageVanityUrl(
  router: Router,
  app,
  url: string,
  pageId: string,
  template = '/page'
) {
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
    const router = new Router();

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

    route('/stories', '/stories', router, nextApp);
    route('/articles', '/articles', router, nextApp);
    route(`/articles/:id(${prismicId})`, '/article', router, nextApp);
    route(`/series/:id(${prismicId})`, '/article-series', router, nextApp);
    route(`/projects/:id(${prismicId})`, '/page', router, nextApp);

    route('/books', '/books', router, nextApp);
    route(`/books/:id(${prismicId})`, '/book', router, nextApp);

    route(`/places/:id(${prismicId})`, '/place', router, nextApp);
    route(`/pages/:id(${prismicId})`, '/page', router, nextApp);
    route(`/seasons/:id(${prismicId})`, '/season', router, nextApp);

    route('/newsletter', '/newsletter', router, nextApp);

    route('/collections', '/page', router, nextApp, {
      id: prismicPageIds.collections,
    });

    route('/guides', '/guides', router, nextApp);
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
    pageVanityUrl(
      router,
      nextApp,
      '/visit-us',
      prismicPageIds.visitUs,
      '/page'
    );
    pageVanityUrl(router, nextApp, '/about-us', prismicPageIds.aboutUs);
    pageVanityUrl(router, nextApp, '/get-involved', prismicPageIds.getInvolved);
    pageVanityUrl(router, nextApp, '/user-panel', prismicPageIds.userPanel);

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
