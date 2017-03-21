import Raven from 'raven';
import {createPageConfig} from '../model/page-config';

Raven.config('https://f756b8d4b492473782987a054aa9a347@sentry.io/133634').install();
export default function() {
  return async function(ctx, next) {
    try {
      await next();
      if (404 == ctx.response.status && !ctx.response.body) ctx.throw(404);
    } catch (err) {
      Raven.captureException(err);

      ctx.status = err.status || 500;
      ctx.render('pages/error', {
        pageConfig: createPageConfig({
          title: `We did a ${err.status} oopsy`
        })
      });
    }
  }
}
