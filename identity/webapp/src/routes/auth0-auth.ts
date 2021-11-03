import Router from '@koa/router';
import { RouteMiddleware } from '../types/application';
import koaPassport from 'koa-passport';
import { config } from '../config';
import * as querystring from 'query-string';
import { URL } from 'url';

const loginAction: RouteMiddleware = (ctx, next) => {
  if (!ctx.session.returnTo) {
    // Don't overwrite returnTo if e.g. user enters wrong password
    ctx.session.returnTo = ctx.request.headers.referer;
  }

  koaPassport.authenticate('auth0', {
    scope: 'openid profile email',
  })(ctx, next);
};

const authCallback: RouteMiddleware = (ctx, next) => {
  return koaPassport.authenticate('auth0', (err, user, info) => {
    if (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit('error', err, ctx);
    }
    if (info === 'unauthorized') {
      return ctx.redirect(`/account/error?${ctx.request.querystring}`);
    }
    if (!user) {
      return ctx.redirect(
        `/account/error?error_description=${encodeURI(
          'An unknown error occurred.'
        )}`
      );
    }
    ctx.login(user, loginError => {
      if (loginError) {
        ctx.status = loginError.status || 500;
        ctx.body = loginError.message;
        ctx.app.emit('error', err, ctx);
      }

      return ctx.redirect(ctx.session.returnTo || '/account');
    });
  })(ctx, next);
};

const logoutAction: RouteMiddleware = ctx => {
  const { returnTo } = ctx.request.query;

  ctx.logout();

  delete ctx.session.returnTo;

  const logoutUri = new URL(`https://${config.auth0.domain}/v2/logout`);

  logoutUri.search = querystring.stringify({
    client_id: config.auth0.clientID,
    returnTo: `${config.logout.redirectUrl || ''}${returnTo || ''}`,
  });

  ctx.redirect(logoutUri.toString());
};

const auth0AuthRouter = new Router();

auth0AuthRouter
  .get('/login', loginAction)
  .get('/callback', authCallback)
  .get('/logout', logoutAction);

export { auth0AuthRouter };
