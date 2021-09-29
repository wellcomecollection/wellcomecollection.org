import { TypedRouter } from './utility/typed-router';
import { ping, pingPost } from './routes/ping';
import { localAuthRoutes } from './routes/local/local-auth';
import { config } from './config';
import { authCallback, loginAction, logoutAction } from './routes/auth';
import { RouteMiddleware } from './types/application';
import { updatePassword } from './routes/api/update-password';
import { registerUser } from './routes/api/register-user';
import { getCurrentUser } from './routes/api/get-current-user';
import { updateCurrentUser } from './routes/api/update-current-user';
import { requestDelete } from './routes/api/request-delete';
import { itemRequests } from './routes/users/item-requests';

const loginRoutes =
  process.env.NODE_ENV === 'production' || config.authMethod === 'auth0'
    ? {
        // There are no routes in a production environment.
      }
    : localAuthRoutes;

// For stubs.
const stubApi: RouteMiddleware = context => {
  context.response.body = { error: 'not implemented' };
  context.response.status = 200;
};

export const router = new TypedRouter({
  // Example: Normal route
  ping: [TypedRouter.GET, '/ping', ping],

  // Example: Post body matching JSON Schema (will be validated)
  'ping-post': [TypedRouter.POST, '/ping', pingPost, 'example'],

  // Auth0 + Passport routes.
  login: [TypedRouter.GET, '/account/login', loginAction],
  logout: [TypedRouter.GET, '/account/logout', logoutAction],
  callback: [TypedRouter.GET, '/account/callback', authCallback],

  // Proxy apis - implemented
  'create-user': [
    TypedRouter.POST,
    '/account/api/user/create',
    registerUser,
    'RegisterUserSchema',
  ],
  'get-current-user': [
    TypedRouter.GET,
    '/account/api/users/me',
    getCurrentUser,
  ],
  'update-current-user': [
    TypedRouter.PUT,
    '/account/api/users/me',
    updateCurrentUser,
  ],
  'update-user-password': [
    TypedRouter.PUT,
    '/account/api/users/me/password',
    updatePassword,
    'UpdatePasswordSchema',
  ],
  'delete-user': [
    TypedRouter.PUT,
    '/account/api/users/me/deletion-request',
    requestDelete,
    'RequestDeleteSchema',
  ],

  'get-item-requests': [
    TypedRouter.GET,
    '/account/api/users/:user_id/item-requests',
    itemRequests,
  ],
  'post-item-requests': [
    TypedRouter.POST,
    '/account/api/users/:user_id/item-requests',
    itemRequests,
  ],

  // Proxy APIs - todo
  'get-user': [TypedRouter.GET, '/account/api/users/:user_id', stubApi],
  'get-users': [TypedRouter.GET, '/account/api/users', stubApi],
  'lock-user-account': [
    TypedRouter.PUT,
    '/account/api/users/:user_id/lock',
    stubApi,
  ],
  'post-users': [TypedRouter.POST, '/account/api/users', stubApi],
  'reset-user-password': [
    TypedRouter.PUT,
    '/account/api/users/:user_id/reset-password',
    stubApi,
  ],
  'send-user-verification': [
    TypedRouter.PUT,
    '/account/api/users/:user_id/send-verification',
    stubApi,
  ],
  'unlock-user-account': [
    TypedRouter.PUT,
    '/account/api/users/:user_id/unlock',
    stubApi,
  ],
  'update-user': [TypedRouter.PUT, '/account/api/users/:user_id', stubApi],

  // Local route overrides.
  ...loginRoutes,
});
