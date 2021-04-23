import { RouteMiddleware } from '../types/application';
import koaPassport from 'koa-passport';
import { withPrefix } from '../utility/prefix';
import { config } from '../config';
import * as querystring from 'query-string';
import { URL } from 'url';

export const loginAction: RouteMiddleware = koaPassport.authenticate('auth0', {
  scope: 'openid profile email',
});

export const authCallback: RouteMiddleware = (ctx, next) => {
  return koaPassport.authenticate('auth0', (err, user, info) => {
    if (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit('error', err, ctx);
    }
    if (info === 'unauthorized') {
      return ctx.redirect(withPrefix(`/error?${ctx.request.querystring}`));
    }
    if (!user) {
      return ctx.redirect(withPrefix(`/error?error_description=${encodeURI('An unknown error occurred.')}`));
    }
    ctx.login(user, loginError => {
      if (loginError) {
        ctx.status = loginError.status || 500;
        ctx.body = loginError.message;
        ctx.app.emit('error', err, ctx);
      }
      return ctx.redirect(withPrefix('/'));
    });
  })(ctx, next);
};

export const logoutAction: RouteMiddleware = context => {
  const { returnTo } = context.request.query;

  context.logout();

  const logoutUri = new URL(`https://${config.auth0.domain}/v2/logout`);

  logoutUri.search = querystring.stringify({
    client_id: config.auth0.clientID,
    returnTo: `${config.logout.redirectUrl || ''}${returnTo || ''}`,
  });

  context.redirect(logoutUri.toString());
};
