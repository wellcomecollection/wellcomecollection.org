import { RouteMiddleware } from '../../types/application';
import { callRemoteApi } from '../../utility/api-caller';
// This will communicate with the backend api to make the call on our behalf.

export const getUser: RouteMiddleware = async (context) => {
  const idNumber = context.state.user.profile.id.replace('auth0|p', '');

  const userResponse = await callRemoteApi('GET', `/users/${idNumber}`, context.state);

  context.response.status = userResponse.status;
  context.response.body = userResponse.data;
};
