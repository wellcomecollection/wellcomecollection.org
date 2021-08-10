import { RouteMiddleware } from '../../types/application';

export const itemRequests: RouteMiddleware<{ user_id: string }> = context => {
  const accessToken = context.state.user.accessToken;
  const userId = context.params.user_id;
  const isAuthenticated = context.isAuthenticated();
  context.response.body = {
    requests: [
      {
        workId: 'a2239muq',
        itemId: 'v9m3ewes',
        type: 'string',
      },
    ],
    totalResults: 2,
    type: 'string',
    is: isAuthenticated,
  };
};
