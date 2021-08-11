import { RouteMiddleware } from '../../types/application';

export const itemRequests: RouteMiddleware<{ user_id: string }> = context => {
  const accessToken = context.state.user.accessToken;
  const userId = context.params.user_id;
  const isAuthenticated = context.isAuthenticated();
  if (context.request.method === 'POST') {
    context.response.status = 202;
    context.response.body = {};
  }
  if (context.request.method === 'GET') {
    context.response.body = {
      requests: [
        {
          workId: 'a2239muq',
          itemId: 'v9m3ewes',
          type: 'string',
        },
        {
          workId: 'a2239muy',
          itemId: 'v9m3ewey',
          type: 'string',
        },
      ],
      totalResults: 2,
      type: 'string',
    };
  }
};
