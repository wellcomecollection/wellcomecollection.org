import { authenticateUser } from '../../middleware/authenticate-user';
import { RouteMiddleware } from '../../types/application';
import { UpdateUserSchema } from '../../types/schemas/update-user';
import { callRemoteApi } from '../../utility/api-caller';

export const updateCurrentUser: RouteMiddleware<Record<string, never>, UpdateUserSchema> = async context => {
  await authenticateUser(context, async () => {
    const { data, status } = await callRemoteApi('PUT', `/users/me`, context.state, {
      email: context.requestBody.email,
    });

    context.response.status = status;
    context.response.body = data;
  });
};
