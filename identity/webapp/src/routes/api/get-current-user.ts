import { RouteMiddleware } from '../../types/application';
import { callRemoteApi } from '../../utility/api-caller';
// This will communicate with the backend api to make the call on our behalf.

export const getCurrentUser: RouteMiddleware = async (context) => {
  const { idNumber } = context.state.user.profile;

  const userResponse = await callRemoteApi('GET', `/users/${idNumber}`, context.state);

  context.response.status = userResponse.status;
  context.response.body = userResponse.data;
};
