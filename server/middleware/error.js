import Raven from 'raven';
import {createPageConfig} from '../model/page-config';

Raven.config('https://2cfb7b8ceb0a4549a4de2010b219a65d:5b48d985281a47e095a73df871b59149@sentry.io/223943').install();
export function serverError(beaconError) {
  return async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      const url = ctx.request.href;
      ctx.status = err.status || 500;

      console.error(err, url, ctx.status);
      if (beaconError && (ctx.status < 400 || ctx.status >= 500)) {
        Raven.captureException(err, {extra: {url: ctx.request.href, statusCode: ctx.status}});
      }

      ctx.render('pages/error', {
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
    await next();
    if (404 === ctx.response.status && !ctx.response.body) {
      ctx.throw(404);

      ctx.render('pages/error', {
        errorStatus: ctx.status,
        pageConfig: createPageConfig({
          title: `${ctx.status} error`
        })
      });
    };
  }
}
