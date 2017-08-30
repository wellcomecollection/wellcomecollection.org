import Raven from 'raven';
import {createPageConfig} from '../model/page-config';

Raven.config('https://605190088e024c3187592cbeca6d2b1d:8405497d82c243f48ef8546c93ba7f49@sentry.io/133634').install();
export default function() {
  return async function(ctx, next) {
    try {
      await next();
      if (404 === ctx.response.status && !ctx.response.body) ctx.throw(404);
    } catch (err) {
      // We don't want to alert on 4xx errors, although they will be tracked in GA
      if (err.status && (err.status < 400 || err.status > 499)) {
        Raven.captureException(err, {extra: {url: ctx.request.href}});
      }
      const path = ctx.request.url;
      console.error(err)
      ctx.status = err.status || 500;

      ctx.render('pages/error', {
        errorStatus: ctx.status,
        pageConfig: createPageConfig({
          path: path,
          title: `${err.status} error`
        })
      });
    }
  }
}
