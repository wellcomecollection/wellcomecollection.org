import {
  withAppPathPrefix,
  getContextPath,
} from '@weco/common/utils/identity-path-prefix';
import { RouteMiddleware } from '../types/application';
import buildHtml from './assets/index.html';

const unAuthenticatedPages: string[] = [
  '/register',
  '/register/old',
  '/validated',
  '/delete-requested',
  '/error',
].map(withAppPathPrefix);

export const indexPage: RouteMiddleware = context => {
  const bundle = context.routes.url('assets-bundles');

  if (
    context.isAuthenticated() ||
    unAuthenticatedPages.includes(context.request.URL.pathname)
  ) {
    console.log('current user ->', context.state.user);
    context.response.body = buildHtml(bundle, getContextPath());
    return;
  }

  context.redirect(withAppPathPrefix('/login'));
};
