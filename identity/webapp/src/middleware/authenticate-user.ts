import { RouteMiddleware } from '../types/application';
import { AuthenticationSchema } from '../types/schemas/auth';
import { callRemoteApi } from '../utility/api-caller';

export const authenticateUser: RouteMiddleware<unknown, AuthenticationSchema> = async (context, next) => {
  const { email, password } = context.requestBody;

  const authResponse = await callRemoteApi('POST', '/auth', context.state, { email, password });

  if (authResponse.status === 200) {
    return next();
  }

  context.response.status = authResponse.status;
  context.response.body = authResponse.data;
};
