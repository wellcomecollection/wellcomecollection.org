import Raven from 'raven';
import {createPageConfig} from '../model/page-config';

export function serverError(beaconError) {
  return async (ctx, next) => {
    const isPreview =
      Boolean(ctx.request.url.match('/preview')) ||
      Boolean(ctx.request.href.match('preview.wellcomecollection.org'));
    try {
      await next();
    } catch (err) {
      const url = ctx.request.href;
      ctx.status = err.status || 500;
      if (beaconError && (ctx.status < 400 || ctx.status >= 500)) {
        Raven.config('https://2cfb7b8ceb0a4549a4de2010b219a65d:5b48d985281a47e095a73df871b59149@sentry.io/223943').install();
        Raven.captureException(err, {extra: {url: ctx.request.href, statusCode: ctx.status}});
      }

      ctx.render('pages/error', {
        isPreview,
        errorStatus: ctx.status,
        pageConfig: createPageConfig({
          title: `${ctx.status} error`
        })
      });
    }
  }
}

export function notFound() {
  return async (ctx, next) => {
    const isPreview = Boolean(ctx.request.url.match('/preview'));
    await next();
    if (404 === ctx.response.status && !ctx.response.body) {
      ctx.throw(404);

      ctx.render('pages/error', {
        isPreview,
        errorStatus: ctx.status,
        pageConfig: createPageConfig({
          title: `${ctx.status} error`
        })
      });
    }
  }
}
