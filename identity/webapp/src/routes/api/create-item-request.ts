import { RouteMiddleware } from '../../types/application';
import { callRemoteApi } from '../../utility/api-caller';

// eslint-disable-next-line camelcase
export const createItemRequest: RouteMiddleware<{ user_id: string }> =
  async context => {
    const { status } = await callRemoteApi(
      'POST',
      `/users/${context.params.user_id}/item-requests`,
      context.state,
      context.requestBody,
      true
    );
    context.response.status = status;
  };
