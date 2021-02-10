import { TypedRouter } from './utility/typed-router';
import { ping, pingPost } from './routes/ping';
import { frontendBundles } from './routes/assets/frontend-bundle';
import { indexPage } from './routes/index';
import { localAuthRoutes } from './routes/local/local-auth';
import { config } from './config';
import { authCallback, loginAction, logoutAction } from './routes/auth';
import { RouteMiddleware } from './types/application';
import { updatePassword } from './routes/api/update-password';
import { registerUser } from './routes/api/register-user';
import { getCurrentUser } from './routes/api/get-current-user';
import { updateCurrentUser } from './routes/api/update-current-user';

const loginRoutes =
  process.env.NODE_ENV === 'production' || config.authMethod === 'auth0'
    ? {
        // There are no routes in a production environment.
      }
    : localAuthRoutes;

// For stubs.
const stubApi: RouteMiddleware = (context) => {
  context.response.body = { error: 'not implemented' };
  context.response.status = 200;
};

export const router = new TypedRouter({
  // Example: Normal route
  ping: [TypedRouter.GET, '/ping', ping],

  // Example: Post body matching JSON Schema (will be validated)
  'ping-post': [TypedRouter.POST, '/ping', pingPost, 'example'],

  // Frontend bundles.
  'assets-bundles': [TypedRouter.GET, '/assets/bundle.js', frontendBundles],
  'assets-sub-bundles': [TypedRouter.GET, '/assets/:bundleName', frontendBundles],

  // Auth0 + Passport routes.
  login: [TypedRouter.GET, '/login', loginAction],
  logout: [TypedRouter.GET, '/logout', logoutAction],
  callback: [TypedRouter.GET, '/callback', authCallback],

  // Proxy apis - implemented
  'create-user': [TypedRouter.POST, '/api/user/create', registerUser, 'RegisterUserSchema'],
  'get-current-user': [TypedRouter.GET, '/api/users/me', getCurrentUser],
  'update-current-user': [TypedRouter.PUT, '/api/users/me', updateCurrentUser],
  'update-user-password': [TypedRouter.PUT, '/api/users/:user_id/password', updatePassword, 'UpdatePasswordSchema'],

  // Proxy APIs - todo
  'delete-user': [TypedRouter.DELETE, '/api/users/:user_id', stubApi],
  'get-user': [TypedRouter.GET, '/api/users/:user_id', stubApi],
  'get-users': [TypedRouter.GET, '/api/users', stubApi],
  'lock-user-account': [TypedRouter.PUT, '/api/users/:user_id/lock', stubApi],
  'post-users': [TypedRouter.POST, '/api/users', stubApi],
  'reset-user-password': [TypedRouter.PUT, '/api/users/:user_id/reset-password', stubApi],
  'send-user-verification': [TypedRouter.PUT, '/api/users/:user_id/send-verification', stubApi],
  'unlock-user-account': [TypedRouter.PUT, '/api/users/:user_id/unlock', stubApi],
  'update-user': [TypedRouter.PUT, '/api/users/:user_id', stubApi],

  // Local route overrides.
  ...loginRoutes,

  // Frontend fallback route.
  frontend: [TypedRouter.GET, '(.*)', indexPage],
});
