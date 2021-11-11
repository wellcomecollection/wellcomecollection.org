import Router from '@koa/router';
import koaBody from 'koa-body';
import { config } from './config';
import { auth0AuthRouter } from './routes/auth0-auth';
import { localAuthRouter } from './routes/local-auth';
import { ApplicationContext, ApplicationState } from './types/application';
import { callRemoteApi } from './utility/api-caller';

export const createRouter = (): Router<
  ApplicationState,
  ApplicationContext
> => {
  const accountRouter = new Router<ApplicationState, ApplicationContext>();

  const authRouter =
    process.env.NODE_ENV === 'production' || config.authMethod === 'auth0'
      ? auth0AuthRouter
      : localAuthRouter;
  accountRouter.use(
    '/account',
    authRouter.routes(),
    authRouter.allowedMethods()
  );

  accountRouter.all('/account/api/:api_route*', koaBody(), async context => {
    const apiRoute = context.params.api_route;
    const { status, data } = await callRemoteApi(apiRoute, context);

    context.response.status = status;
    context.response.body = data;
  });

  return accountRouter;
};
