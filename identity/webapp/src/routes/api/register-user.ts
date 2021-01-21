import { RouteMiddleware } from '../../types/application';
import { RegisterUserSchema } from '../../types/schemas/register-user';
import { callRemoteApi } from '../../utility/api-caller';
// This will communicate with the backend api to make the call on our behalf.

export const registerUser: RouteMiddleware<{
  firstName: string;
  lastName: string;
  email: string;
  password: string; }, RegisterUserSchema> = async (context) => {

  const body = context.requestBody; // type = RegisterUserSchema

  // Make call to API.
  const registerResponse = await callRemoteApi('POST', '/users', body);

  // Return whatever you want to the user.
  context.response.status = registerResponse.status;
  return registerResponse;
};
