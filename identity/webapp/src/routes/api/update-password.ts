import { RouteMiddleware } from '../../types/application';
import { UpdatePasswordSchema } from '../../types/schemas/update-password';
import { callRemoteApi } from '../../utility/api-caller';

export const updatePassword: RouteMiddleware<UpdatePasswordSchema> = async (context) => {
  const validateUserResponse = await callRemoteApi('POST', '/users/me/validate', context.state, {
    password: context.requestBody.currentPassword,
  });

  if (validateUserResponse.status === 200) {
    const updatePasswordResponse = await callRemoteApi('PUT', '/users/me/password', context.state, {
      password: context.requestBody.newPassword,
    });

    context.response.status = updatePasswordResponse.status;
    context.response.body = updatePasswordResponse.data;

    return;
  }

  context.response.status = validateUserResponse.status;
  return;
};
