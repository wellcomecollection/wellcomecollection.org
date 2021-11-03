import Router from '@koa/router';
import { RouteMiddleware } from '../types/application';

const localAuthRouter = new Router();

const loginForm: RouteMiddleware = ctx => {
  ctx.response.body = `
      <form method="post" action="/account/login">
        <input type="text" name="username" />
        <input type="password" name="password" />
        <input type="submit" />
      </form>
    `;
};

const callbackResponse: RouteMiddleware = ctx => {
  ctx.status = 404;
};

const logoutRedirect: RouteMiddleware = ctx => {
  ctx.logout();
  ctx.redirect('/');
};

localAuthRouter
  .get('/login', loginForm)
  .get('/callback', callbackResponse)
  .get('/logout', logoutRedirect);

export { localAuthRouter };
