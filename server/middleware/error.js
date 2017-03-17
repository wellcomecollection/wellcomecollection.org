import {createPageConfig} from '../model/page-config';
export default function() {
  return async function(ctx, next) {
    try {
      await next();
      if (404 == ctx.response.status && !ctx.response.body) ctx.throw(404);
    } catch (err) {
      const errorObj = {
        message: err.message,
        stack: err.stack,
        status: ctx.status,
        code: err.code
      };
      ctx.status = err.status || 500;
      ctx.render('pages/error', {
        pageConfig: createPageConfig({
          title: 'Articles',
          inSection: 'explore'
        }),
        error: errorObj
      });
    }
  }
}
