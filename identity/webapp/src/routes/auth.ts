import {RouteMiddleware} from '../types/application';
import koaPassport from 'koa-passport';
import {withPrefix} from '../utility/prefix';
import {config} from '../config';
import * as querystring from 'querystring';
import {router} from "../router";
import * as url from "url";

export const loginAction: RouteMiddleware = koaPassport.authenticate('auth0', {
  scope: 'openid profile email',
});

export const authCallback: RouteMiddleware = koaPassport.authenticate('auth0', {
  successRedirect: withPrefix('/'),
  failureRedirect: '/',
  scope: 'openid profile email',
});

export const logoutAction: RouteMiddleware = (context) => {
  context.logout();

  const logoutUri = new url.URL(`https://${config.auth0.domain}/v2/logout`);

  logoutUri.search = querystring.stringify({
    client_id: config.auth0.clientID,
    returnTo: router.url('login'),
  });

  context.redirect(logoutUri.toString());
};
