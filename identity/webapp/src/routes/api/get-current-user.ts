import { RouteMiddleware } from '../../types/application';
import { callRemoteApi } from '../../utility/api-caller';

export const getCurrentUser: RouteMiddleware = async (context) => {
  const { data, status } = await callRemoteApi('GET', `/users/me`, context.state);
  context.response.status = status;
  context.response.body = data;
};
