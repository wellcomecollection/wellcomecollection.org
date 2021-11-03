import Router from '@koa/router';
import koaBody from 'koa-body';
import { requestBody } from './middleware/request-body';
import { config } from './config';
import { auth0AuthRouter } from './routes/auth0-auth';
import { localAuthRouter } from './routes/local-auth';
import {
  registerUser,
  getCurrentUser,
  updateCurrentUser,
  updatePassword,
  requestDelete,
  getItemRequests,
  createItemRequest,
} from './routes/api';
import { ApplicationContext, ApplicationState } from './types/application';

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
    koaBody(),
    authRouter.routes(),
    authRouter.allowedMethods()
  );

  const apiRouter = new Router<ApplicationState, ApplicationContext>();
  apiRouter.use(koaBody());

  apiRouter
    .post('/user/create', requestBody('RegisterUserSchema'), registerUser)
    .get('/users/me', getCurrentUser)
    .put('/users/me', updateCurrentUser)
    .put(
      '/users/me/password',
      requestBody('UpdatePasswordSchema'),
      updatePassword
    )
    .put(
      '/users/me/deletion-request',
      requestBody('RequestDeleteSchema'),
      requestDelete
    )
    .get('/users/:user_id/item-requests', getItemRequests)
    .post('/users/:user_id/item-requests', createItemRequest);

  accountRouter.use(
    '/account/api',
    apiRouter.routes(),
    apiRouter.allowedMethods()
  );

  return accountRouter;
};
