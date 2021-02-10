import { authenticateUser } from '../../middleware/authenticate-user';
import { RouteMiddleware } from '../../types/application';
import { UpdateUserSchema } from '../../types/schemas/update-user';
import { callRemoteApi } from '../../utility/api-caller';

export const updateCurrentUser: RouteMiddleware<unknown, UpdateUserSchema> = async (context) => {
  await authenticateUser(context, async () => {
    const { idNumber } = context.state.user.profile;
    const { newEmail } = context.requestBody;

    const updateUserResponse = await callRemoteApi('PUT', `/users/${idNumber}`, context.state, {
      email: newEmail,
    });

    context.response.status = updateUserResponse.status;
    context.response.body = updateUserResponse.data;
    return;
  });
};
