const Koa = require('koa');
const Router = require('koa-router');
const next = require('next');
const Prismic = require('prismic-javascript');
const linkResolver = require('@weco/common/services/prismic/link-resolver');
const bodyParser = require('koa-bodyparser');
const fetch = require('isomorphic-unfetch');
require('dotenv').config();
const dotmailerCreds = JSON.parse(process.env.dotmailer_creds);
const { newsletterApiUsername, newsletterApiPassword } = dotmailerCreds;

const {
  middleware,
  route,
  handleAllRoute,
} = require('@weco/common/koa-middleware/withCachedValues');

// FIXME: Find a way to import this.
// We can't because it's not a standard es6 module (import and flowtype)
const Periods = {
  Today: 'today',
  ThisWeekend: 'this-weekend',
  CurrentAndComingUp: 'current-and-coming-up',
  Past: 'past',
  ComingUp: 'coming-up',
  ThisWeek: 'this-week',
};
const periodPaths = Object.keys(Periods)
  .map(key => Periods[key])
  .join('|');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

function pageVanityUrl(router, app, url, pageId, template = '/page') {
  route(url, template, router, app, { id: pageId });
}

module.exports = app
  .prepare()
  .then(async () => {
    const server = new Koa();
    const router = new Router();

    server.use(middleware);
    server.use(bodyParser());

    route('/', '/homepage', router, app);
    route('/whats-on', '/whats-on', router, app);
    route(`/whats-on/:period(${periodPaths})`, '/whats-on', router, app);

    route('/exhibitions', '/exhibitions', router, app);
    route(`/exhibitions/:period(${periodPaths})`, '/exhibitions', router, app);
    route('/exhibitions/:id', '/exhibition', router, app);

    route('/events', '/events', router, app);
    route(`/events/:period(${periodPaths})`, '/events', router, app);
    route('/events/:id', '/event', router, app);
    route('/event-series/:id', '/event-series', router, app);

    route('/stories', '/stories', router, app);
    route('/articles', '/articles', router, app);
    route('/articles/:id', '/article', router, app);
    route('/series/:id', '/article-series', router, app);

    route('/books', '/books', router, app);
    route('/books/:id', '/book', router, app);

    route('/places/:id', '/place', router, app);
    route('/pages/:id', '/page', router, app);

    route('/newsletter', '/newsletter', router, app);

    pageVanityUrl(router, app, '/opening-times', 'WwQHTSAAANBfDYXU');
    pageVanityUrl(router, app, '/what-we-do', 'WwLGFCAAAPMiB_Ps');
    pageVanityUrl(router, app, '/press', 'WuxrKCIAAP9h3hmw');
    pageVanityUrl(router, app, '/venue-hire', 'Wuw2MSIAACtd3SsC');
    pageVanityUrl(router, app, '/access', 'Wvm2uiAAAIYQ4FHP');
    pageVanityUrl(router, app, '/youth', 'Wuw2MSIAACtd3Ste');
    pageVanityUrl(router, app, '/schools', 'Wuw2MSIAACtd3StS');
    pageVanityUrl(router, app, '/visit-us', 'WwLIBiAAAPMiB_zC', '/visit-us');

    router.post('/newsletter-signup', async (ctx, next) => {
      const { addressbookid, email } = ctx.request.body;
      const newsletterApiUrl = 'https://r1-api.dotmailer.com/v2';
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(
          `${newsletterApiUsername}:${newsletterApiPassword}`
        ).toString('base64')}`,
      };
      const newBody = JSON.stringify({
        Email: email,
        OptInType: 'VerifiedDouble',
      });
      const resubscribeBody = JSON.stringify({
        UnsubscribedContact: {
          Email: email,
        },
      });
      const newResponse = await fetch(
        `${newsletterApiUrl}/address-books/${addressbookid}/contacts`,
        {
          method: 'POST',
          headers: headers,
          body: newBody,
        }
      );
      const newJson = await newResponse.json();
      const { message } = newJson;
      const isSuppressed = message && message.match(/ERROR_CONTACT_SUPPRESSED/);

      if (isSuppressed) {
        const resubscribeResponse = await fetch(
          `${newsletterApiUrl}/contacts/resubscribe`,
          {
            method: 'POST',
            headers: headers,
            body: resubscribeBody,
          }
        );

        const resubscribeJson = await resubscribeResponse.json();

        ctx.body = resubscribeJson;
      } else {
        ctx.body = newJson;
      }

      next();
    });

    router.get('/preview', async ctx => {
      // Kill any cookie we had set, as it think it is causing issues.
      ctx.cookies.set(Prismic.previewCookie);

      const token = ctx.request.query.token;
      const api = await Prismic.getApi(
        'https://wellcomecollection.prismic.io/api/v2',
        {
          req: ctx.request,
        }
      );
      const url = await api.previewSession(token, linkResolver, '/');
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

    server.use(async (ctx, next) => {
      ctx.res.statusCode = 200;
      await next();
    });

    server.use(router.routes());

    return server;
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
