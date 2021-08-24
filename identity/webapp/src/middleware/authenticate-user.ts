import { RouteMiddleware } from '../types/application';
import { AuthenticationSchema } from '../types/schemas/auth';
import { callRemoteApi } from '../utility/api-caller';

export const authenticateUser: RouteMiddleware<Record<string, never>, AuthenticationSchema> = async (context, next) => {
  const { password } = context.requestBody;

  const authResponse = await callRemoteApi('POST', '/users/me/validate', context.state, { password });

  if (authResponse.status === 200) {
    return next();
  }

  context.response.status = authResponse.status;
  context.response.body = authResponse.data;
};
