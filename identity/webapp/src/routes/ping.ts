import { Example } from '../types/schemas/Example';
import { RouteMiddleware } from '../types/application';

export const ping: RouteMiddleware = (context) => {
  context.response.body = { ping: 'pong' };
};

export const pingPost: RouteMiddleware<{ id: string }, Example> = (context) => {
  const body = context.requestBody;
  const id = context.params.id;

  context.response.body = { id, body };
};
