import { RouteMiddleware } from '../../types/application';
import { UpdatePasswordSchema } from '../../types/schemas/update-password';
import { callRemoteApi } from '../../utility/api-caller';

export const requestDelete: RouteMiddleware<UpdatePasswordSchema> = async (context) => {
  const validateUserResponse = await callRemoteApi('POST', '/users/me/validate', context.state, {
    password: context.requestBody.currentPassword,
  });

  if (validateUserResponse.status === 200) {
    const requestDeleteResponse = await callRemoteApi('DELETE', '/users/me', context.state, {
      password: context.requestBody.newPassword,
    });

    context.response.status = requestDeleteResponse.status;
    context.response.body = requestDeleteResponse.data;

    return;
  }

  context.response.status = validateUserResponse.status;
  return;
};
