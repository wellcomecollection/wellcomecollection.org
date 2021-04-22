import { withPrefix } from '../utility/prefix';
import { RouteMiddleware } from '../types/application';
import { prefix } from '../utility/prefix';
import buildHtml from './assets/index.html';

const unAuthenticatedPages: string[] = ['/register', '/register/old', '/validated', '/delete-requested', '/error'].map(
  route => {
    return prefix ? prefix + route : route;
  }
);

export const indexPage: RouteMiddleware = context => {
  const bundle = context.routes.url('assets-bundles');

  if (context.isAuthenticated() || unAuthenticatedPages.includes(context.request.URL.pathname)) {
    console.log('current user ->', context.state.user);
    context.response.body = buildHtml(bundle, prefix);
    return;
  }

  context.redirect(withPrefix('/login'));
};
