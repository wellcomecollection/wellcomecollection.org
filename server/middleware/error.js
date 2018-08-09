import Raven from 'raven';
import {createPageConfig} from '../model/page-config';
import {isPreview} from '../../common/services/prismic/api';

export function error(beaconError) {
  return async (ctx, next) => {
    try {
      await next();
      if (404 === ctx.response.status && !ctx.response.body) {
        const err = new Error('Not found');
        err.statusCode = 404;
        throw err;
      }
    } catch (err) {
      const url = ctx.request.href;
      ctx.status = err.statusCode || err.status || 500;
      ctx.render('pages/error', {
        isPreview: isPreview(ctx.response),
        errorStatus: ctx.status,
        pageConfig: createPageConfig({
          title: `${ctx.status} error`
        })
      });

      if (beaconError && (ctx.status < 400 || ctx.status >= 500)) {
        Raven.config('https://2cfb7b8ceb0a4549a4de2010b219a65d:5b48d985281a47e095a73df871b59149@sentry.io/223943').install();
        Raven.captureException(err, {extra: {url: ctx.request.href, statusCode: ctx.status}});
      }
    }
  }
}
