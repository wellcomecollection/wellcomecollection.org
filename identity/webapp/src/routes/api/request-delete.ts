import { authenticateUser } from '../../middleware/authenticate-user';
import { RouteMiddleware } from '../../types/application';
import { RequestDeleteSchema } from '../../types/schemas/request-delete';
import { callRemoteApi } from '../../utility/api-caller';

export const requestDelete: RouteMiddleware<Record<string, never>, RequestDeleteSchema> = async (context) => {
  await authenticateUser(context, async () => {
    const { data, status } = await callRemoteApi('PUT', '/users/me/deletion-request', context.state);

    context.response.status = status;
    context.response.body = data;
  });
};
