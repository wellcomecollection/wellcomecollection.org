import { RouteMiddleware } from '../../types/application';
import { callRemoteApi } from '../../utility/api-caller';

// eslint-disable-next-line camelcase
export const getItemRequests: RouteMiddleware<{ user_id: string }> =
  async context => {
    const { data, status } = await callRemoteApi(
      'GET',
      `/users/${context.params.user_id}/item-requests`,
      context.state
    );
    context.response.status = status;
    context.response.body = data;
  };
