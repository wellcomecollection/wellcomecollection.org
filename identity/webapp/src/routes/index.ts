import { RouteMiddleware } from '../types/application';
import buildHtml from './assets/index.html';

const unAuthenticatedPages: string[] = [
  '/account/register',
  '/account/register/old',
  '/account/validated',
  '/account/delete-requested',
  '/account/error',
];

export const indexPage: RouteMiddleware = context => {
  const bundle = context.routes.url('assets-bundles');
  if (context.request.URL.pathname === '/account/healthcheck') {
    context.response.body = 'ok';
    return;
  }

  if (
    context.isAuthenticated() ||
    unAuthenticatedPages.includes(context.request.URL.pathname)
  ) {
    // This cookie is set on the login button before we do the auth dance
    // Hack, indeed.
    const returnTo = context.cookies.get('returnTo');
    if (returnTo) {
      context.cookies.set('returnTo', null);
      context.redirect(returnTo);
    } else {
      context.response.body = buildHtml(bundle);
    }
    return;
  }

  context.redirect('/account/login');
};
