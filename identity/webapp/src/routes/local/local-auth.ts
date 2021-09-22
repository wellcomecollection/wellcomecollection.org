import { TypedRouter } from '../../utility/typed-router';
import { RouteMiddleware } from '../../types/application';

export const localAuthRoutes: any = {
  login: [
    TypedRouter.GET,
    '/account/login',
    (ctx => {
      ctx.response.body = `
      <form method="post" action="/account/login">
        <input type="text" name="username" />
        <input type="password" name="password" />
        <input type="submit" />
      </form>
    `;
    }) as RouteMiddleware,
  ],
  // Disable the callback for now.
  callback: [
    TypedRouter.GET,
    '/account/callback',
    (ctx => {
      ctx.status = 404;
    }) as RouteMiddleware,
  ],

  logout: [
    TypedRouter.GET,
    '/account/logout',
    (ctx => {
      ctx.logout();
      ctx.redirect('/');
    }) as RouteMiddleware,
  ],
};
