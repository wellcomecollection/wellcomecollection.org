import Router from '@koa/router';
import { config } from './config';
import { auth0AuthRouter } from './routes/auth0-auth';
import { localAuthRouter } from './routes/local-auth';
import { updatePassword } from './routes/api/update-password';
import { registerUser } from './routes/api/register-user';
import { getCurrentUser } from './routes/api/get-current-user';
import { updateCurrentUser } from './routes/api/update-current-user';
import { requestDelete } from './routes/api/request-delete';
import { itemRequests } from './routes/users/item-requests';
import koaBody from 'koa-body';
import { requestBody } from './middleware/request-body';

export const createRouter = (prefix: string): Router => {
  const accountRouter = new Router({ prefix });
  const apiRouter = new Router();

  accountRouter.use(koaBody());

  const authRouter =
    process.env.NODE_ENV === 'production' || config.authMethod === 'auth0'
      ? auth0AuthRouter
      : localAuthRouter;
  accountRouter.use(authRouter.routes(), authRouter.allowedMethods());

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
    .get('/users/:user_id/item-requests', itemRequests)
    .post('/users/:user_id/item-requests', itemRequests);

  accountRouter.use('/api', apiRouter.routes(), apiRouter.allowedMethods());

  return accountRouter;
};
