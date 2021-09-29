import { RouteMiddleware } from '../../types/application';
import { callRemoteApi } from '../../utility/api-caller';

// eslint-disable-next-line camelcase
export const itemRequests: RouteMiddleware<{ user_id: string }> =
  async context => {
    if (context.request.method === 'POST') {
      const { status } = await callRemoteApi(
        'POST',
        `/users/${context.params.user_id}/item-requests`,
        context.state,
        context.requestBody,
        true
      );
      context.response.status = status;
    }

    if (context.request.method === 'GET') {
      const { data, status } = await callRemoteApi(
        'GET',
        `/users/${context.params.user_id}/item-requests`,
        context.state
      );
      context.response.status = status;
      context.response.body = data;
    }
  };
