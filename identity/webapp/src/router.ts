import Router from '@koa/router';
import koaBody from 'koa-body';
import { ApplicationContext, ApplicationState } from './types/application';
import { callRemoteApi } from './utility/api-caller';

export const createRouter = (): Router<
  ApplicationState,
  ApplicationContext
> => {
  const accountRouter = new Router<ApplicationState, ApplicationContext>();

  accountRouter.all(
    '/account/api/users/:api_route*',
    koaBody(),
    async context => {
      const apiRoute = 'users/' + context.params.api_route;
      const { status, data } = await callRemoteApi(apiRoute, context);

      context.response.status = status;
      context.response.body = data;
    }
  );

  return accountRouter;
};
