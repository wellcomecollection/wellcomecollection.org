import { rest } from 'msw';
import { mockUser } from './UserInfo.mock';

export const handlers = [
  rest.put('/api/resend-activation-email/3141592', (_req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.get(new RegExp('/api/user/123'), (_req, res, ctx) => {
    return res(ctx.json(mockUser));
  }),
  rest.put(new RegExp('/api/user/123'), (_req, res, ctx) => {
    return res(ctx.json(mockUser));
  }),
];
