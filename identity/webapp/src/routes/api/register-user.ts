import { RouteMiddleware } from '../../types/application';
import { RegisterUserSchema } from '../../types/schemas/register-user';
import { callRemoteApi } from '../../utility/api-caller';

export const registerUser: RouteMiddleware<Record<string, never>, RegisterUserSchema> = async (context) => {
  const { status } = await callRemoteApi('POST', '/users', context.state, context.requestBody, false);

  context.response.status = status;
};
