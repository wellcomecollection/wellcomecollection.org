import { authenticateUser } from '../../middleware/authenticate-user';
import { RouteMiddleware } from '../../types/application';
import { UpdatePasswordSchema } from '../../types/schemas/update-password';
import { callRemoteApi } from '../../utility/api-caller';

export const updatePassword: RouteMiddleware<Record<string, never>, UpdatePasswordSchema> = async (context) => {
  await authenticateUser(context, async () => {
    const { data, status } = await callRemoteApi('PUT', '/users/me/password', context.state, {
      password: context.requestBody.newPassword,
    });

    context.response.status = status;
    context.response.body = data;
  });
};
