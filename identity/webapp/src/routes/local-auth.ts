import Router from '@koa/router';

const localAuthRouter = new Router();

const loginForm = ctx => {
  ctx.response.body = `
      <form method="post" action="/account/login">
        <input type="text" name="username" />
        <input type="password" name="password" />
        <input type="submit" />
      </form>
    `;
};

const callbackResponse = ctx => {
  ctx.status = 404;
};

const logoutRedirect = ctx => {
  ctx.logout();
  ctx.redirect('/');
};

localAuthRouter
  .get('/login', loginForm)
  .get('/callback', callbackResponse)
  .get('/logout', logoutRedirect);

export { localAuthRouter };
