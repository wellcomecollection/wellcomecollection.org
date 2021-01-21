import { TypedRouter } from '../../utility/typed-router';
import koaPassport from 'koa-passport';
import { RouteMiddleware } from '../../types/application';

export const localAuthRoutes: any = {
  login: [
    TypedRouter.GET,
    '/login',
    ((ctx) => {
      ctx.response.body = `
      <form method="post" action="/login">
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
    '/callback',
    ((ctx) => {
      ctx.status = 404;
    }) as RouteMiddleware,
  ],

  logout: [
    TypedRouter.GET,
    '/logout',
    ((ctx) => {
      ctx.logout();
      ctx.redirect('/');
    }) as RouteMiddleware,
  ],

  // This is only for local.
  'post-login': [
    TypedRouter.POST,
    '/login',
    koaPassport.authenticate('local', {
      successRedirect: '/app',
      failureRedirect: '/',
    }),
  ],
};
